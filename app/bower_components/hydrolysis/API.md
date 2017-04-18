## Objects
<dl>
<dt><a href="#hydrolysis">hydrolysis</a> : <code>object</code></dt>
<dd><p>Static analysis for Polymer.</p>
</dd>
</dl>
## Functions
<dl>
<dt><a href="#isSiblingOrAunt">isSiblingOrAunt()</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns true if <code>patha</code> is a sibling or aunt of <code>pathb</code>.</p>
</dd>
<dt><a href="#redirectSibling">redirectSibling()</a> ⇒ <code>string</code></dt>
<dd><p>Change <code>localPath</code> from a sibling of <code>basePath</code> to be a child of
<code>basePath</code> joined with <code>redirect</code>.</p>
</dd>
<dt><a href="#ProtocolRedirect">ProtocolRedirect(config)</a></dt>
<dd><p>A single redirect configuration</p>
</dd>
</dl>
<a name="hydrolysis"></a>
## hydrolysis : <code>object</code>
Static analysis for Polymer.

**Kind**: global namespace  

* [hydrolysis](#hydrolysis) : <code>object</code>
  * [.Analyzer](#hydrolysis.Analyzer)
    * [new Analyzer(attachAST, [loader])](#new_hydrolysis.Analyzer_new)
    * _instance_
      * [.elements](#hydrolysis.Analyzer+elements) : <code>Array.&lt;ElementDescriptor&gt;</code>
      * [.elementsByTagName](#hydrolysis.Analyzer+elementsByTagName) : <code>Object.&lt;string, ElementDescriptor&gt;</code>
      * [.features](#hydrolysis.Analyzer+features) : <code>Array.&lt;FeatureDescriptor&gt;</code>
      * [.behaviors](#hydrolysis.Analyzer+behaviors) : <code>Array.&lt;BehaviorDescriptor&gt;</code>
      * [.behaviorsByName](#hydrolysis.Analyzer+behaviorsByName) : <code>Object.&lt;string, BehaviorDescriptor&gt;</code>
      * [.html](#hydrolysis.Analyzer+html) : <code>Object.&lt;string, AnalyzedDocument&gt;</code>
      * [.parsedDocuments](#hydrolysis.Analyzer+parsedDocuments) : <code>Object</code>
      * [.parsedScripts](#hydrolysis.Analyzer+parsedScripts) : <code>Object.&lt;string, Array.&lt;ParsedJS&gt;&gt;</code>
      * [._content](#hydrolysis.Analyzer+_content) : <code>Object</code>
      * [._getDependencies(href, [found], [transitive])](#hydrolysis.Analyzer+_getDependencies) ⇒ <code>Array.&lt;string&gt;</code>
      * [.elementsForFolder(href)](#hydrolysis.Analyzer+elementsForFolder) ⇒ <code>Array.&lt;ElementDescriptor&gt;</code>
      * [.behaviorsForFolder(href)](#hydrolysis.Analyzer+behaviorsForFolder) ⇒ <code>Array.&lt;BehaviorDescriptor&gt;</code>
      * [.metadataTree(href)](#hydrolysis.Analyzer+metadataTree) ⇒ <code>Promise</code>
      * [.getLoadedAst(href, [loaded])](#hydrolysis.Analyzer+getLoadedAst) ⇒ <code>Promise.&lt;DocumentAST&gt;</code>
      * [.nodeWalkDocuments(predicate)](#hydrolysis.Analyzer+nodeWalkDocuments) ⇒ <code>Object</code>
      * [.nodeWalkAllDocuments(predicate)](#hydrolysis.Analyzer+nodeWalkAllDocuments) ⇒ <code>Object</code>
      * [.annotate()](#hydrolysis.Analyzer+annotate)
      * [.clean()](#hydrolysis.Analyzer+clean)
    * _static_
      * [.analyze(href, [options])](#hydrolysis.Analyzer.analyze) ⇒ <code>Promise.&lt;Analyzer&gt;</code>
  * [.FileLoader](#hydrolysis.FileLoader)
    * [new FileLoader()](#new_hydrolysis.FileLoader_new)
    * [.addResolver(resolver)](#hydrolysis.FileLoader+addResolver)
    * [.request(url)](#hydrolysis.FileLoader+request) ⇒ <code>Promise.&lt;string&gt;</code>
  * [.FSResolver](#hydrolysis.FSResolver)
    * [new FSResolver(config)](#new_hydrolysis.FSResolver_new)
  * [.NoopResolver](#hydrolysis.NoopResolver)
    * [new NoopResolver(config)](#new_hydrolysis.NoopResolver_new)
    * [.accept(uri, deferred)](#hydrolysis.NoopResolver+accept) ⇒ <code>boolean</code>
  * [.RedirectResolver](#hydrolysis.RedirectResolver)
    * [new RedirectResolver(config, redirects)](#new_hydrolysis.RedirectResolver_new)
  * [.XHRResolver](#hydrolysis.XHRResolver)
    * [new XHRResolver(config)](#new_hydrolysis.XHRResolver_new)
  * [.DocumentAST](#hydrolysis.DocumentAST) : <code>Object</code>
  * [.JSAST](#hydrolysis.JSAST) : <code>Object</code>
  * [.ParsedJS](#hydrolysis.ParsedJS) : <code>Object</code>
  * [.ElementDescriptor](#hydrolysis.ElementDescriptor) : <code>Object</code>
  * [.FeatureDescriptor](#hydrolysis.FeatureDescriptor) : <code>Object</code>
  * [.BehaviorDescriptor](#hydrolysis.BehaviorDescriptor) : <code>Object</code>
  * [.DocumentDescriptor](#hydrolysis.DocumentDescriptor) : <code>Object</code>
  * [.AnalyzedDocument](#hydrolysis.AnalyzedDocument) : <code>Object</code>
  * [.LoadOptions](#hydrolysis.LoadOptions) : <code>Object</code>
  * [.Resolver](#hydrolysis.Resolver) : <code>Object</code>

<a name="hydrolysis.Analyzer"></a>
### hydrolysis.Analyzer
**Kind**: static class of <code>[hydrolysis](#hydrolysis)</code>  

* [.Analyzer](#hydrolysis.Analyzer)
  * [new Analyzer(attachAST, [loader])](#new_hydrolysis.Analyzer_new)
  * _instance_
    * [.elements](#hydrolysis.Analyzer+elements) : <code>Array.&lt;ElementDescriptor&gt;</code>
    * [.elementsByTagName](#hydrolysis.Analyzer+elementsByTagName) : <code>Object.&lt;string, ElementDescriptor&gt;</code>
    * [.features](#hydrolysis.Analyzer+features) : <code>Array.&lt;FeatureDescriptor&gt;</code>
    * [.behaviors](#hydrolysis.Analyzer+behaviors) : <code>Array.&lt;BehaviorDescriptor&gt;</code>
    * [.behaviorsByName](#hydrolysis.Analyzer+behaviorsByName) : <code>Object.&lt;string, BehaviorDescriptor&gt;</code>
    * [.html](#hydrolysis.Analyzer+html) : <code>Object.&lt;string, AnalyzedDocument&gt;</code>
    * [.parsedDocuments](#hydrolysis.Analyzer+parsedDocuments) : <code>Object</code>
    * [.parsedScripts](#hydrolysis.Analyzer+parsedScripts) : <code>Object.&lt;string, Array.&lt;ParsedJS&gt;&gt;</code>
    * [._content](#hydrolysis.Analyzer+_content) : <code>Object</code>
    * [._getDependencies(href, [found], [transitive])](#hydrolysis.Analyzer+_getDependencies) ⇒ <code>Array.&lt;string&gt;</code>
    * [.elementsForFolder(href)](#hydrolysis.Analyzer+elementsForFolder) ⇒ <code>Array.&lt;ElementDescriptor&gt;</code>
    * [.behaviorsForFolder(href)](#hydrolysis.Analyzer+behaviorsForFolder) ⇒ <code>Array.&lt;BehaviorDescriptor&gt;</code>
    * [.metadataTree(href)](#hydrolysis.Analyzer+metadataTree) ⇒ <code>Promise</code>
    * [.getLoadedAst(href, [loaded])](#hydrolysis.Analyzer+getLoadedAst) ⇒ <code>Promise.&lt;DocumentAST&gt;</code>
    * [.nodeWalkDocuments(predicate)](#hydrolysis.Analyzer+nodeWalkDocuments) ⇒ <code>Object</code>
    * [.nodeWalkAllDocuments(predicate)](#hydrolysis.Analyzer+nodeWalkAllDocuments) ⇒ <code>Object</code>
    * [.annotate()](#hydrolysis.Analyzer+annotate)
    * [.clean()](#hydrolysis.Analyzer+clean)
  * _static_
    * [.analyze(href, [options])](#hydrolysis.Analyzer.analyze) ⇒ <code>Promise.&lt;Analyzer&gt;</code>

<a name="new_hydrolysis.Analyzer_new"></a>
#### new Analyzer(attachAST, [loader])
A database of Polymer metadata defined in HTML


| Param | Type | Description |
| --- | --- | --- |
| attachAST | <code>boolean</code> | If true, attach a parse5 compliant AST |
| [loader] | <code>FileLoader</code> | An optional `FileLoader` used to load external                              resources |

<a name="hydrolysis.Analyzer+elements"></a>
#### analyzer.elements : <code>Array.&lt;ElementDescriptor&gt;</code>
A list of all elements the `Analyzer` has metadata for.

**Kind**: instance property of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
<a name="hydrolysis.Analyzer+elementsByTagName"></a>
#### analyzer.elementsByTagName : <code>Object.&lt;string, ElementDescriptor&gt;</code>
A view into `elements`, keyed by tag name.

**Kind**: instance property of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
<a name="hydrolysis.Analyzer+features"></a>
#### analyzer.features : <code>Array.&lt;FeatureDescriptor&gt;</code>
A list of API features added to `Polymer.Base` encountered by the
analyzer.

**Kind**: instance property of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
<a name="hydrolysis.Analyzer+behaviors"></a>
#### analyzer.behaviors : <code>Array.&lt;BehaviorDescriptor&gt;</code>
The behaviors collected by the analysis pass.

**Kind**: instance property of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
<a name="hydrolysis.Analyzer+behaviorsByName"></a>
#### analyzer.behaviorsByName : <code>Object.&lt;string, BehaviorDescriptor&gt;</code>
The behaviors collected by the analysis pass by name.

**Kind**: instance property of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
<a name="hydrolysis.Analyzer+html"></a>
#### analyzer.html : <code>Object.&lt;string, AnalyzedDocument&gt;</code>
A map, keyed by absolute path, of Document metadata.

**Kind**: instance property of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
<a name="hydrolysis.Analyzer+parsedDocuments"></a>
#### analyzer.parsedDocuments : <code>Object</code>
A map, keyed by path, of HTML document ASTs.

**Kind**: instance property of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
<a name="hydrolysis.Analyzer+parsedScripts"></a>
#### analyzer.parsedScripts : <code>Object.&lt;string, Array.&lt;ParsedJS&gt;&gt;</code>
A map, keyed by path, of JS script ASTs.

If the path is an HTML file with multiple scripts, the entry will be an array of scripts.

**Kind**: instance property of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
<a name="hydrolysis.Analyzer+_content"></a>
#### analyzer._content : <code>Object</code>
A map, keyed by path, of document content.

**Kind**: instance property of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
<a name="hydrolysis.Analyzer+_getDependencies"></a>
#### analyzer._getDependencies(href, [found], [transitive]) ⇒ <code>Array.&lt;string&gt;</code>
List all the html dependencies for the document at `href`.

**Kind**: instance method of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> - A list of all the html dependencies.  

| Param | Type | Description |
| --- | --- | --- |
| href | <code>string</code> | The href to get dependencies for. |
| [found] | <code>Object.&lt;string, boolean&gt;</code> | An object keyed by URL of the     already resolved dependencies. |
| [transitive] | <code>boolean</code> | Whether to load transitive     dependencies. Defaults to true. |

<a name="hydrolysis.Analyzer+elementsForFolder"></a>
#### analyzer.elementsForFolder(href) ⇒ <code>Array.&lt;ElementDescriptor&gt;</code>
Returns the elements defined in the folder containing `href`.

**Kind**: instance method of <code>[Analyzer](#hydrolysis.Analyzer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| href | <code>string</code> | path to search. |

<a name="hydrolysis.Analyzer+behaviorsForFolder"></a>
#### analyzer.behaviorsForFolder(href) ⇒ <code>Array.&lt;BehaviorDescriptor&gt;</code>
Returns the behaviors defined in the folder containing `href`.

**Kind**: instance method of <code>[Analyzer](#hydrolysis.Analyzer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| href | <code>string</code> | path to search. |

<a name="hydrolysis.Analyzer+metadataTree"></a>
#### analyzer.metadataTree(href) ⇒ <code>Promise</code>
Returns a promise that resolves to a POJO representation of the import
tree, in a format that maintains the ordering of the HTML imports spec.

**Kind**: instance method of <code>[Analyzer](#hydrolysis.Analyzer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| href | <code>string</code> | the import to get metadata for. |

<a name="hydrolysis.Analyzer+getLoadedAst"></a>
#### analyzer.getLoadedAst(href, [loaded]) ⇒ <code>Promise.&lt;DocumentAST&gt;</code>
Returns a promise resolving to a form of the AST with all links replaced
with the document they link to. .css and .script files become &lt;style&gt; and
&lt;script&gt;, respectively.

The elements in the loaded document are unmodified from their original
documents.

**Kind**: instance method of <code>[Analyzer](#hydrolysis.Analyzer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| href | <code>string</code> | The document to load. |
| [loaded] | <code>Object.&lt;string, boolean&gt;</code> | An object keyed by already loaded documents. |

<a name="hydrolysis.Analyzer+nodeWalkDocuments"></a>
#### analyzer.nodeWalkDocuments(predicate) ⇒ <code>Object</code>
Calls `dom5.nodeWalkAll` on each document that `Anayzler` has laoded.

**Kind**: instance method of <code>[Analyzer](#hydrolysis.Analyzer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>Object</code> | A dom5 predicate. |

<a name="hydrolysis.Analyzer+nodeWalkAllDocuments"></a>
#### analyzer.nodeWalkAllDocuments(predicate) ⇒ <code>Object</code>
Calls `dom5.nodeWalkAll` on each document that `Anayzler` has laoded.

**Kind**: instance method of <code>[Analyzer](#hydrolysis.Analyzer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>Object</code> | A dom5 predicate. |

<a name="hydrolysis.Analyzer+annotate"></a>
#### analyzer.annotate()
Annotates all loaded metadata with its documentation.

**Kind**: instance method of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
<a name="hydrolysis.Analyzer+clean"></a>
#### analyzer.clean()
Removes redundant properties from the collected descriptors.

**Kind**: instance method of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
<a name="hydrolysis.Analyzer.analyze"></a>
#### Analyzer.analyze(href, [options]) ⇒ <code>Promise.&lt;Analyzer&gt;</code>
Shorthand for transitively loading and processing all imports beginning at
`href`.

In order to properly filter paths, `href` _must_ be an absolute URI.

**Kind**: static method of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
**Returns**: <code>Promise.&lt;Analyzer&gt;</code> - A promise that will resolve once `href` and its
    dependencies have been loaded and analyzed.  

| Param | Type | Description |
| --- | --- | --- |
| href | <code>string</code> | The root import to begin loading from. |
| [options] | <code>LoadOptions</code> | Any additional options for the load. |

<a name="hydrolysis.FileLoader"></a>
### hydrolysis.FileLoader
**Kind**: static class of <code>[hydrolysis](#hydrolysis)</code>  

* [.FileLoader](#hydrolysis.FileLoader)
  * [new FileLoader()](#new_hydrolysis.FileLoader_new)
  * [.addResolver(resolver)](#hydrolysis.FileLoader+addResolver)
  * [.request(url)](#hydrolysis.FileLoader+request) ⇒ <code>Promise.&lt;string&gt;</code>

<a name="new_hydrolysis.FileLoader_new"></a>
#### new FileLoader()
A FileLoader lets you resolve URLs with a set of potential resolvers.

<a name="hydrolysis.FileLoader+addResolver"></a>
#### fileLoader.addResolver(resolver)
Add an instance of a Resolver class to the list of url resolvers

Ordering of resolvers is most to least recently added
The first resolver to "accept" the url wins.

**Kind**: instance method of <code>[FileLoader](#hydrolysis.FileLoader)</code>  

| Param | Type | Description |
| --- | --- | --- |
| resolver | <code>Resolver</code> | The resolver to add. |

<a name="hydrolysis.FileLoader+request"></a>
#### fileLoader.request(url) ⇒ <code>Promise.&lt;string&gt;</code>
Return a promise for an absolute url

Url requests are deduplicated by the loader, returning the same Promise for
identical urls

**Kind**: instance method of <code>[FileLoader](#hydrolysis.FileLoader)</code>  
**Returns**: <code>Promise.&lt;string&gt;</code> - A promise that resolves to the contents of the URL.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The absolute url to request. |

<a name="hydrolysis.FSResolver"></a>
### hydrolysis.FSResolver
**Kind**: static class of <code>[hydrolysis](#hydrolysis)</code>  
<a name="new_hydrolysis.FSResolver_new"></a>
#### new FSResolver(config)
Resolves requests via the file system.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | configuration options. |
| config.host | <code>string</code> | Hostname to match for absolute urls.     Matches "/" by default |
| config.basePath | <code>string</code> | Prefix directory for components in url.     Defaults to "/". |
| config.root | <code>string</code> | Filesystem root to search. Defaults to the     current working directory. |
| config.redirect | <code>string</code> | Where to redirect lookups to siblings. |

<a name="hydrolysis.NoopResolver"></a>
### hydrolysis.NoopResolver
**Kind**: static class of <code>[hydrolysis](#hydrolysis)</code>  

* [.NoopResolver](#hydrolysis.NoopResolver)
  * [new NoopResolver(config)](#new_hydrolysis.NoopResolver_new)
  * [.accept(uri, deferred)](#hydrolysis.NoopResolver+accept) ⇒ <code>boolean</code>

<a name="new_hydrolysis.NoopResolver_new"></a>
#### new NoopResolver(config)
A resolver that resolves to null any uri matching config.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>string</code> | The url to `accept`. |

<a name="hydrolysis.NoopResolver+accept"></a>
#### noopResolver.accept(uri, deferred) ⇒ <code>boolean</code>
**Kind**: instance method of <code>[NoopResolver](#hydrolysis.NoopResolver)</code>  
**Returns**: <code>boolean</code> - Whether the URI is handled by this resolver.  

| Param | Type | Description |
| --- | --- | --- |
| uri | <code>string</code> | The absolute URI being requested. |
| deferred | <code>Deferred</code> | The deferred promise that should be resolved if     this resolver handles the URI. |

<a name="hydrolysis.RedirectResolver"></a>
### hydrolysis.RedirectResolver
**Kind**: static class of <code>[hydrolysis](#hydrolysis)</code>  
<a name="new_hydrolysis.RedirectResolver_new"></a>
#### new RedirectResolver(config, redirects)
Resolves protocol://hostname/path to the local filesystem.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | configuration options. |
| config.root | <code>string</code> | Filesystem root to search. Defaults to the     current working directory. |
| redirects | <code>[Array.&lt;ProtocolRedirect&gt;](#ProtocolRedirect)</code> | A list of protocol redirects     for the resolver. They are checked for matching first-to-last. |

<a name="hydrolysis.XHRResolver"></a>
### hydrolysis.XHRResolver
**Kind**: static class of <code>[hydrolysis](#hydrolysis)</code>  
<a name="new_hydrolysis.XHRResolver_new"></a>
#### new XHRResolver(config)
Construct a resolver that requests resources over XHR.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | configuration arguments. |
| config.responseType | <code>string</code> | Type of object to be returned by the     XHR. Defaults to 'text', accepts 'document', 'arraybuffer', and 'json'. |

<a name="hydrolysis.DocumentAST"></a>
### hydrolysis.DocumentAST : <code>Object</code>
Parse5's representation of a parsed html document

**Kind**: static typedef of <code>[hydrolysis](#hydrolysis)</code>  
<a name="hydrolysis.JSAST"></a>
### hydrolysis.JSAST : <code>Object</code>
espree's representation of a parsed html document

**Kind**: static typedef of <code>[hydrolysis](#hydrolysis)</code>  
<a name="hydrolysis.ParsedJS"></a>
### hydrolysis.ParsedJS : <code>Object</code>
Package of a parsed JS script

**Kind**: static typedef of <code>[hydrolysis](#hydrolysis)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| ast | <code>JSAST</code> | The script's AST |
| scriptElement | <code>DocumentAST</code> | If inline, the script's containing tag. |

<a name="hydrolysis.ElementDescriptor"></a>
### hydrolysis.ElementDescriptor : <code>Object</code>
The metadata for a single polymer element

**Kind**: static typedef of <code>[hydrolysis](#hydrolysis)</code>  
<a name="hydrolysis.FeatureDescriptor"></a>
### hydrolysis.FeatureDescriptor : <code>Object</code>
The metadata for a Polymer feature.

**Kind**: static typedef of <code>[hydrolysis](#hydrolysis)</code>  
<a name="hydrolysis.BehaviorDescriptor"></a>
### hydrolysis.BehaviorDescriptor : <code>Object</code>
The metadata for a Polymer behavior mixin.

**Kind**: static typedef of <code>[hydrolysis](#hydrolysis)</code>  
<a name="hydrolysis.DocumentDescriptor"></a>
### hydrolysis.DocumentDescriptor : <code>Object</code>
The metadata for all features and elements defined in one document

**Kind**: static typedef of <code>[hydrolysis](#hydrolysis)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| elements | <code>Array.&lt;ElementDescriptor&gt;</code> | The elements from the document |
| features | <code>Array.&lt;FeatureDescriptor&gt;</code> | The features from the document |
| behaviors | <code>Array.&lt;FeatureDescriptor&gt;</code> | The behaviors from the document |

<a name="hydrolysis.AnalyzedDocument"></a>
### hydrolysis.AnalyzedDocument : <code>Object</code>
The metadata of an entire HTML document, in promises.

**Kind**: static typedef of <code>[hydrolysis](#hydrolysis)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| href | <code>string</code> | The url of the document. |
| htmlLoaded | <code>Promise.&lt;ParsedImport&gt;</code> | The parsed representation of     the doc. Use the `ast` property to get the full `parse5` ast |
| depsLoaded | <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> | Resolves to the list of this     Document's transitive import dependencies |
| depHrefs | <code>Array.&lt;string&gt;</code> | The direct dependencies of the document. |
| metadataLoaded | <code>Promise.&lt;DocumentDescriptor&gt;</code> | Resolves to the list of     this Document's import dependencies |

<a name="hydrolysis.LoadOptions"></a>
### hydrolysis.LoadOptions : <code>Object</code>
Options for `Analyzer.analzye`

**Kind**: static typedef of <code>[hydrolysis](#hydrolysis)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| noAnnotations | <code>boolean</code> | Whether `annotate()` should be skipped. |
| clean | <code>boolean</code> | Whether the generated descriptors should be cleaned     of redundant data. |
| filter | <code>function</code> | A predicate function that     indicates which files should be ignored by the loader. By default all     files not located under the dirname of `href` will be ignored. |

<a name="hydrolysis.Resolver"></a>
### hydrolysis.Resolver : <code>Object</code>
An object that knows how to resolve resources.

**Kind**: static typedef of <code>[hydrolysis](#hydrolysis)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| accept | <code>function</code> | Attempt to resolve     `deferred` with the contents the specified URL. Returns false if the     Resolver is unable to resolve the URL. |

<a name="isSiblingOrAunt"></a>
## isSiblingOrAunt() ⇒ <code>boolean</code>
Returns true if `patha` is a sibling or aunt of `pathb`.

**Kind**: global function  
<a name="redirectSibling"></a>
## redirectSibling() ⇒ <code>string</code>
Change `localPath` from a sibling of `basePath` to be a child of
`basePath` joined with `redirect`.

**Kind**: global function  
<a name="ProtocolRedirect"></a>
## ProtocolRedirect(config)
A single redirect configuration

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | The configuration object |
| config.protocol | <code>string</code> | The protocol this redirect matches. |
| config.hostname | <code>string</code> | The host name this redirect matches. |
| config.path | <code>string</code> | The part of the path to match and                                     replace with 'redirectPath' |
| config.redirectPath | <code>string</code> | The local filesystem path that should                                     replace "protocol://hosname/path/" |


* [ProtocolRedirect(config)](#ProtocolRedirect)
  * [.protocol](#ProtocolRedirect+protocol) : <code>string</code>
  * [.hostname](#ProtocolRedirect+hostname) : <code>string</code>
  * [.path](#ProtocolRedirect+path) : <code>string</code>
  * [.redirectPath](#ProtocolRedirect+redirectPath) : <code>string</code>

<a name="ProtocolRedirect+protocol"></a>
### protocolRedirect.protocol : <code>string</code>
The protocol this redirect matches.

**Kind**: instance property of <code>[ProtocolRedirect](#ProtocolRedirect)</code>  
<a name="ProtocolRedirect+hostname"></a>
### protocolRedirect.hostname : <code>string</code>
The host name this redirect matches.

**Kind**: instance property of <code>[ProtocolRedirect](#ProtocolRedirect)</code>  
<a name="ProtocolRedirect+path"></a>
### protocolRedirect.path : <code>string</code>
The part of the path to match and replace with 'redirectPath'

**Kind**: instance property of <code>[ProtocolRedirect](#ProtocolRedirect)</code>  
<a name="ProtocolRedirect+redirectPath"></a>
### protocolRedirect.redirectPath : <code>string</code>
The local filesystem path that should replace "protocol://hosname/path/"

**Kind**: instance property of <code>[ProtocolRedirect](#ProtocolRedirect)</code>  
