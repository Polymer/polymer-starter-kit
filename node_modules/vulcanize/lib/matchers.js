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

var constants = require('./constants');
var dom5 = require('dom5');
var p = dom5.predicates;

var urlAttrMatchers = constants.URL_ATTR.map(function(attr) {
  return p.hasAttr(attr);
});

var urlAttrs = p.OR.apply(null, urlAttrMatchers);

var jsMatcher = p.AND(
  p.hasTagName('script'),
  p.OR(
    p.NOT(
      p.hasAttr('type')
    ),
    p.hasAttrValue('type', 'text/javascript'),
    p.hasAttrValue('type', 'application/javascript')
  )
);

var externalStyle = p.AND(
  p.hasTagName('link'),
  p.hasAttrValue('rel', 'stylesheet')
);
  // polymer specific external stylesheet
var polymerExternalStyle = p.AND(
  p.hasTagName('link'),
  p.hasAttrValue('rel', 'import'),
  p.hasAttrValue('type', 'css')
);

var styleMatcher = p.AND(
  p.hasTagName('style'),
  p.OR(
    p.NOT(
      p.hasAttr('type')
    ),
    p.hasAttrValue('type', 'text/css')
  )
);

var targetMatcher = p.AND(
  p.OR(
    p.hasTagName('a'),
    p.hasTagName('form')
  ),
  p.NOT(p.hasAttr('target'))
);

module.exports = {
  head: p.hasTagName('head'),
  body: p.hasTagName('body'),
  base: p.hasTagName('base'),
  domModule: p.AND(
    p.hasTagName('dom-module'),
    p.hasAttr('id'),
    p.NOT(
      p.hasAttr('assetpath')
    )
  ),
  meta: p.AND(
    p.hasTagName('meta'),
    p.hasAttr('charset')
  ),
  polymerElement: p.hasTagName('polymer-element'),
  urlAttrs: urlAttrs,
  targetMatcher: targetMatcher,
  polymerExternalStyle: polymerExternalStyle,
  JS: jsMatcher,
  CSS: styleMatcher,
  CSS_LINK: externalStyle,
  POLY_CSS_LINK: polymerExternalStyle,
  ALL_CSS_LINK: p.OR(externalStyle, polymerExternalStyle),
  JS_SRC: p.AND(p.hasAttr('src'), jsMatcher),
  JS_INLINE: p.AND(p.NOT(p.hasAttr('src')), jsMatcher),
};
