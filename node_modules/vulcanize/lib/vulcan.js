/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

// jshint node: true
'use strict';

var path = require('path');
var url = require('url');
var pathPosix = path.posix || require('path-posix');
var hyd = require('hydrolysis');
var dom5 = require('dom5');
var CommentMap = require('./comment-map');
var constants = require('./constants');
var matchers = require('./matchers');
var PathResolver = require('./pathresolver');
var encodeString = require('../third_party/UglifyJS2/output');

var Promise = global.Promise || require('es6-promise').Promise;

/**
 * This is the copy of vulcanize we keep to simulate the setOptions api.
 *
 * TODO(garlicnation): deprecate and remove setOptions API in favor of constructor.
 */
var singleton;

function buildLoader(config) {
  var abspath = config.abspath;
  var excludes = config.excludes;
  var fsResolver = config.fsResolver;
  var redirects = config.redirects;
  var loader = new hyd.Loader();
  if (fsResolver) {
    loader.addResolver(fsResolver);
  } else {
  var fsOptions = {};
    if (abspath) {
      fsOptions.root = path.resolve(abspath);
      fsOptions.basePath = '/';
    }
    loader.addResolver(new hyd.FSResolver(fsOptions));
  }
  // build null HTTPS? resolver to skip external scripts
  loader.addResolver(new hyd.NoopResolver(constants.EXTERNAL_URL));
  var redirectOptions = {};
  if (abspath) {
    redirectOptions.root =  path.resolve(abspath);
    redirectOptions.basePath = '/';
  }
  var redirectConfigs = [];
  for (var i = 0; i < redirects.length; i++) {
    var split = redirects[i].split('|');
    var uri = url.parse(split[0]);
    var replacement = split[1];
    if (!uri || !replacement) {
      throw new Error("Invalid redirect config: " + redirects[i]);
    }
    var redirectConfig = new hyd.RedirectResolver.ProtocolRedirect({
        protocol: uri.protocol,
        hostname: uri.hostname,
        path: uri.pathname,
        redirectPath: replacement
      });
    redirectConfigs.push(redirectConfig);
  }
  if (redirectConfigs.length > 0) {
    redirectOptions.redirects = redirectConfigs;
    loader.addResolver(new hyd.RedirectResolver(redirectOptions));
  }
  if (excludes) {
    excludes.forEach(function(r) {
      loader.addResolver(new hyd.NoopResolver(r));
    });
  }
  return loader;
}

var Vulcan = function Vulcan(opts) {
    // implicitStrip should be true by default
  this.implicitStrip = opts.implicitStrip === undefined ? true : Boolean(opts.implicitStrip);
  this.abspath = (String(opts.abspath) === opts.abspath && String(opts.abspath).trim() !== '') ? path.resolve(opts.abspath) : null;
  this.pathResolver = new PathResolver(this.abspath);
  this.addedImports = Array.isArray(opts.addedImports) ? opts.addedImports : [];
  this.excludes = Array.isArray(opts.excludes) ? opts.excludes : [];
  this.stripExcludes = Array.isArray(opts.stripExcludes) ? opts.stripExcludes : [];
  this.stripComments = Boolean(opts.stripComments);
  this.enableCssInlining = Boolean(opts.inlineCss);
  this.enableScriptInlining = Boolean(opts.inlineScripts);
  this.inputUrl = String(opts.inputUrl) === opts.inputUrl ? opts.inputUrl : '';
  this.fsResolver = opts.fsResolver;
  this.redirects = Array.isArray(opts.redirects) ? opts.redirects : [];
  if (!opts.loader) {
    this.loader = buildLoader({
      abspath: this.abspath,
      fsResolver: this.fsResolver,
      excludes: this.excludes,
      redirects: this.redirects
    });
  } else {
    this.loader = opts.loader;
  }
};

Vulcan.prototype = {
  isDuplicateImport: function isDuplicateImport(importMeta) {
    return !Boolean(importMeta.href);
  },

  reparent: function reparent(newParent) {
    return function(node) {
      node.parentNode = newParent;
    };
  },

  isExcludedImport: function isExcludedImport(importMeta) {
    return this.isExcludedHref(importMeta.href);
  },

  isExcludedHref: function isExcludedHref(href) {
    if (constants.EXTERNAL_URL.test(href)) {
      return true;
    }
    if (!this.excludes) {
      return false;
    }
    return this.excludes.some(function(r) {
      return href.search(r) >= 0;
    });
  },

  isStrippedImport: function isStrippedImport(importMeta) {
    if (!this.stripExcludes.length) {
      return false;
    }
    var href = importMeta.href;
    return this.stripExcludes.some(function(r) {
      return href.search(r) >= 0;
    });
  },

  isBlankTextNode: function isBlankTextNode(node) {
    return node && dom5.isTextNode(node) && !/\S/.test(dom5.getTextContent(node));
  },

  hasOldPolymer: function hasOldPolymer(doc) {
    return Boolean(dom5.query(doc, matchers.polymerElement));
  },

  replaceWith: function replaceWith(head, node, replacements) {
    replacements.forEach(this.reparent(head));
    var idx = head.childNodes.indexOf(node);
    if (idx >= 0) {
      var til = idx + 1;
      var next = head.childNodes[til];
      // remove newline text node as well
      if (this.isBlankTextNode(next)) {
        til++;
      }
      head.childNodes = head.childNodes.slice(0, idx).
        concat(replacements, head.childNodes.slice(til));
    } else {
      this.removeImportAndNewline(node);
      head.childNodes = head.childNodes.concat(replacements);
    }
  },

  // when removing imports, remove the newline after it as well
  removeImportAndNewline: function removeImportAndNewline(importNode) {
    var parent = importNode.parentNode;
    var nextIdx = parent.childNodes.indexOf(importNode) + 1;
    var next = parent.childNodes[nextIdx];
    // remove next node if it is blank text
    if (this.isBlankTextNode(next)) {
      dom5.remove(next);
    }
    dom5.remove(importNode);
  },

  isLicenseComment: function(node) {
    if (dom5.isCommentNode(node)) {
      return dom5.getTextContent(node).indexOf('@license') > -1;
    }
    return false;
  },

  flatten: function flatten(tree, bodyFragment, mainDocUrl) {
    var doc = tree.html.ast;
    var imports = tree.imports;
    var head = dom5.query(doc, matchers.head);
    var body = dom5.query(doc, matchers.body);
    var importNodes = tree.html.import;
    // early check for old polymer versions
    if (this.hasOldPolymer(doc)) {
      throw new Error(constants.OLD_POLYMER + ' File: ' + this.pathResolver.urlToPath(tree.href));
    }
    this.fixFakeExternalScripts(doc);
    this.pathResolver.acid(doc, tree.href);
    if (imports) {
      // flatten all of <head> into one list
      var flatHead = dom5.queryAll(head, function(){ return true; });
      for (var i = 0, im, thisImport; i < imports.length; i++) {
        im = imports[i];
        thisImport = importNodes[i];
        if (this.isDuplicateImport(im)) {
          this.removeImportAndNewline(thisImport);
          continue;
        }
        if (this.isStrippedImport(im)) {
          this.removeImportAndNewline(thisImport);
          continue;
        }
        if (this.isExcludedImport(im)) {
          continue;
        }
        var importDoc = this.flatten(im, bodyFragment, mainDocUrl);
        // rewrite urls
        this.pathResolver.resolvePaths(importDoc, im.href, tree.href);
        var importHead = dom5.query(importDoc, matchers.head);
        var importBody = dom5.query(importDoc, matchers.body);
        // merge head and body tags for imports into main document
        var importHeadChildren = importHead.childNodes;
        var importBodyChildren = importBody.childNodes;
        // make sure @license comments from import document make it into head
        // check top level nodes
        var licenseComments = importDoc.childNodes.filter(this.isLicenseComment);
        var importHtml = importHead.parentNode;
        // check child nodes of <html>
        licenseComments = licenseComments.concat(importHtml.childNodes.filter(this.isLicenseComment));
        // put license comments at the top of <head>
        importHeadChildren = licenseComments.concat(importHeadChildren);
        // delete link
        this.removeImportAndNewline(thisImport);
        // defer head children to be ordered properly in main document
        if (importHeadChildren.length) {
          this.pathResolver.resolvePaths(importHead, tree.href, mainDocUrl);
          importHeadChildren.forEach(this.reparent(bodyFragment));
          bodyFragment.childNodes = bodyFragment.childNodes.concat(importHeadChildren);
        }
        // defer body children to be inlined in-order
        if (importBodyChildren.length) {
          // adjust body urls to main document
          this.pathResolver.resolvePaths(importBody, tree.href, mainDocUrl);
          importBodyChildren.forEach(this.reparent(bodyFragment));
          bodyFragment.childNodes = bodyFragment.childNodes.concat(importBodyChildren);
        }
        // to preserve script execution order, defer scripts after this import
        // into body
        var importInBody = Boolean(dom5.nodeWalkPrior(thisImport, matchers.body));
        if (!importInBody) {
          // only examine elements between this and the next import
          var start = flatHead.indexOf(thisImport) + 1;
          var end = flatHead.indexOf(importNodes[i + 1]);
          var container = this.findElementsToMoveToBody(flatHead, start, end);
          // repath nodes moving to bodyFragment
          if (container.childNodes.length) {
            this.pathResolver.resolvePaths(container, tree.href, mainDocUrl);
            dom5.append(bodyFragment, container);
          }
        }
      }
    }
    return doc;
  },

  /**
   * Return a document fragment with elements that need to be moved to <body> to
   * preserve order of execution of scripts
   */
  findElementsToMoveToBody: function(flatHead, startIndex, endIndex) {
    if (endIndex === -1) {
      endIndex = flatHead.length;
    }
    var container = dom5.constructors.fragment();
    for (var headidx = startIndex, el; headidx < endIndex; headidx++) {
      el = flatHead[headidx];
      // if the element is a script, move it to bodyFragment
      if (matchers.JS(el)) {
        dom5.append(container, el);
      }
    }
    return container;
  },

  prepend: function prepend(parent, node) {
    if (parent.childNodes.length) {
      dom5.insertBefore(parent, parent.childNodes[0], node);
    } else {
      dom5.append(parent, node);
    }
  },
  
  fixFakeExternalScripts: function fixFakeExternalScripts(doc) {
    var scripts = dom5.queryAll(doc, matchers.JS_INLINE);
    scripts.map(function(script) {
      if (script.__hydrolysisInlined) {
        dom5.setAttribute(script, 'src', script.__hydrolysisInlined);
      }
    });
  },
  
  // inline scripts into document, returns a promise resolving to document.
  inlineScripts: function inlineScripts(doc, href) {
    var scripts = dom5.queryAll(doc, matchers.JS_SRC);
    var scriptPromises = scripts.map(function(script) {
      var src = dom5.getAttribute(script, 'src');
      var uri = url.resolve(href, src);
      // let the loader handle the requests
      if (this.isExcludedHref(src)) {
        return Promise.resolve(true);
      }
      return this.loader.request(uri).then(function(content) {
        if (content) {
          content = encodeString(content);
          dom5.removeAttribute(script, 'src');
          dom5.setTextContent(script, content);
        }
      });
    }.bind(this));
    // When all scripts are read, return the document
    return Promise.all(scriptPromises).then(function(){ return {doc: doc, href: href}; });
  },


  // inline scripts into document, returns a promise resolving to document.
  inlineCss: function inlineCss(doc, href) {
    var css_links = dom5.queryAll(doc, matchers.ALL_CSS_LINK);
    var cssPromises = css_links.map(function(link) {
      var tag = link;
      var src = dom5.getAttribute(tag, 'href');
      var media = dom5.getAttribute(tag, 'media');
      var uri = url.resolve(href, src);
      var isPolymerExternalStyle = matchers.polymerExternalStyle(tag);

      // let the loader handle the requests
      if (this.isExcludedHref(src)) {
        return Promise.resolve(true);
      }
      // let the loader handle the requests
      return this.loader.request(uri).then(function(content) {
        if (content) {
          content = this.pathResolver.rewriteURL(uri, href, content);
          if (media) {
            content = '@media ' + media + ' {' + content + '}';
          }
          var style = dom5.constructors.element('style');
          dom5.setTextContent(style, '\n' + content + '\n');

          if (isPolymerExternalStyle) {
            // a polymer expternal style <link type="css" rel="import"> must be
            // in a <dom-module> to be processed
            var ownerDomModule = dom5.nodeWalkPrior(tag, dom5.predicates.hasTagName('dom-module'));
            if (ownerDomModule) {
              var domTemplate = dom5.query(ownerDomModule, dom5.predicates.hasTagName('template'));
              if (!domTemplate) {
                // create a <template>, which has a fragment as childNodes[0]
                domTemplate = dom5.constructors.element('template');
                domTemplate.childNodes.push(dom5.constructors.fragment());
                dom5.append(ownerDomModule, domTemplate);
              }
              dom5.remove(tag);
              // put the style at the top of the dom-module's template
              this.prepend(domTemplate.childNodes[0], style);
            }
          } else {
            dom5.replace(tag, style);
          }
        }
      }.bind(this));
    }.bind(this));
    // When all style imports are read, return the document
    return Promise.all(cssPromises).then(function(){ return {doc: doc, href: href}; });
  },

  getImplicitExcludes: function getImplicitExcludes(excludes) {
    // Build a loader that doesn't have to stop at our excludes, since we need them.
    var loader = buildLoader({
      abspath: this.abspath,
      fsResolver: this.fsResolver,
      redirects: this.redirects
    });
    var analyzer = new hyd.Analyzer(true, loader);
    var analyzedExcludes = [];
    excludes.forEach(function(exclude) {
      if (exclude.match(/.js$/)) {
        return;
      }
      if (exclude.match(/.css$/)) {
        return;
      }
      if (exclude.slice(-1) === '/') {
        return;
      }
      var depPromise = analyzer._getDependencies(exclude);
      depPromise.catch(function(err) {
        // include that this was an excluded url in the error message.
        err.message += '. Could not read dependencies for excluded URL: ' + exclude;
      });
      analyzedExcludes.push(depPromise);
    });
    return Promise.all(analyzedExcludes).then(function(strippedExcludes) {
      var dedupe = {};
      strippedExcludes.forEach(function(excludeList){
        excludeList.forEach(function(exclude) {
          dedupe[exclude] = true;
        });
      });
      return Object.keys(dedupe);
    });
  },

  _process: function _process(target, cb) {
    var chain = Promise.resolve(true);
    if (this.implicitStrip && this.excludes) {
      chain = this.getImplicitExcludes(this.excludes).then(function(implicitExcludes) {
        implicitExcludes.forEach(function(strippedExclude) {
          this.stripExcludes.push(strippedExclude);
        }.bind(this));
      }.bind(this));
    }
    var analyzer = new hyd.Analyzer(true, this.loader);
    chain = chain.then(function(){
      return analyzer.metadataTree(target);
    }).then(function(tree) {
      // hide bodies of imports from rendering
      var bodyFragment = dom5.constructors.element('div');
      dom5.setAttribute(bodyFragment, 'hidden', '');
      dom5.setAttribute(bodyFragment, 'by-vulcanize', '');
      var flatDoc = this.flatten(tree, bodyFragment, tree.href);
      var body = dom5.query(flatDoc, matchers.body);
      if (bodyFragment.childNodes.length) {
        this.prepend(body, bodyFragment);
      }
      // make sure there's a <meta charset> in the page to force UTF-8
      var meta = dom5.query(flatDoc, matchers.meta);
      var head = dom5.query(flatDoc, matchers.head);
      for (var i = 0; i < this.addedImports.length; i++) {
        var newImport = dom5.constructors.element('link');
        dom5.setAttribute(newImport, 'rel', 'import');
        dom5.setAttribute(newImport, 'href', this.addedImports[i]);
        this.prepend(head, newImport);
      }
      if (!meta) {
        meta = dom5.constructors.element('meta');
        dom5.setAttribute(meta, 'charset', 'UTF-8');
        this.prepend(head, meta);
      }
      return {doc: flatDoc, href: tree.href};
    }.bind(this));
    if (this.enableScriptInlining) {
      chain = chain.then(function(docObj) {
        return this.inlineScripts(docObj.doc, docObj.href);
      }.bind(this));
    }
    if (this.enableCssInlining) {
      chain = chain.then(function(docObj) {
        return this.inlineCss(docObj.doc, docObj.href);
      }.bind(this));
    }
    if (this.stripComments) {
      chain = chain.then(function(docObj) {
        var comments = new CommentMap();
        var doc = docObj.doc;
        var head = dom5.query(doc, matchers.head);
        // remove all comments
        dom5.nodeWalkAll(doc, dom5.isCommentNode).forEach(function(comment) {
          comments.set(comment.data, comment);
          dom5.remove(comment);
        });
        // Deduplicate license comments
        comments.keys().forEach(function (commentData) {
          if (commentData.indexOf("@license") == -1) {
            return;
          }
          this.prepend(head, comments.get(commentData));
        }, this);
        return docObj;
      }.bind(this));
    }
    chain.then(function(docObj) {
      cb(null, dom5.serialize(docObj.doc));
    }).catch(cb);
  },

  process: function process(target, cb) {
    if (this.inputUrl) {
      this._process(this.inputUrl, cb);
    } else {
      if (this.abspath) {
        target = pathPosix.resolve('/', target);
      } else {
        target = this.pathResolver.pathToUrl(path.resolve(target));
      }
      this._process(target, cb);
    }
  }
};

Vulcan.process = function process(target, cb) {
  singleton.process(target, cb);
};

Vulcan.setOptions = function setOptions(opts) {
  singleton = new Vulcan(opts);
};

module.exports = Vulcan;
