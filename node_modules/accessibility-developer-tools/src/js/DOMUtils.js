// Copyright 2015 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('axs.dom');

/**
 * Returns the nearest ancestor which is an Element.
 * @param {Node} node
 * @return {?Element}
 */
axs.dom.parentElement = function(node) {
    if (!node)
        return null;

    var parentNode = axs.dom.composedParentNode(node);
    if (!parentNode)
        return null;

    switch (parentNode.nodeType) {
    case Node.ELEMENT_NODE:
        return /** @type {Element} */ (parentNode);
    default:
        return axs.dom.parentElement(parentNode);
    }
};

/**
 * Returns the shadow host of a document fragment if it is a Shadow DOM fragment
 * otherwise returns `null`.
 * @param {DocumentFragment} fragment
 * @return {?Element}
 */
axs.dom.shadowHost = function(fragment) {
    // If host exists, this is a Shadow DOM fragment.
    if ('host' in fragment)
        return fragment.host;
    else
        return null;
};

/**
 * Returns the given Node's parent in the composed tree.
 * @param {Node} node
 * @return {?Node}
 */
axs.dom.composedParentNode = function(node) {
    if (!node)
        return null;
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
        return axs.dom.shadowHost(/** @type {DocumentFragment} */ (node));

    var parentNode = node.parentNode;
    if (!parentNode)
        return null;

    if (parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
        return axs.dom.shadowHost(/** @type {DocumentFragment} */ (parentNode));

    if (!parentNode.shadowRoot)
        return parentNode;

    var insertionPoints = node.getDestinationInsertionPoints();
    if (insertionPoints.length > 0)
        return axs.dom.composedParentNode(insertionPoints[insertionPoints.length - 1]);

    return null;
};

/**
 * Return the corresponding element for the given node.
 * @param {Node} node
 * @return {Element}
 * @suppress {checkTypes}
 */
axs.dom.asElement = function(node) {
    /** @type {Element} */ var element;
    switch (node.nodeType) {
    case Node.COMMENT_NODE:
        return null;  // Skip comments
    case Node.ELEMENT_NODE:
        element = /** (@type {Element}) */ node;
        if (element.localName == 'script' ||
            element.localName == 'template')
            return null;  // Skip script-supporting elements
        return element;
    case Node.DOCUMENT_FRAGMENT_NODE:
        return node.host;
    case Node.TEXT_NODE:
        return axs.dom.parentElement(node);
    default:
        console.warn('Unhandled node type: ', node.nodeType);
    }
    return null;
};

/**
 * Recursively walk the composed tree from |node|, aborting if |end| is encountered.
 * @param {Node} node
 * @param {?Node} end
 * @param {{preorder: (function (Node):boolean|undefined),
 *          postorder: (function (Node)|undefined)}} callbacks
 *     Callbacks to be called for each element traversed, excluding
 *     |end|. Possible callbacks are |preorder|, called before descending into
 *     child nodes, and |postorder| called after all child nodes have been
 *     traversed. If |preorder| returns false, its child nodes will not be
 *     traversed.
 * @param {ShadowRoot=} opt_shadowRoot The nearest ShadowRoot ancestor, if any.
 * @return {boolean} Whether |end| was found, if provided.
 */
axs.dom.composedTreeSearch = function(node, end, callbacks, opt_shadowRoot) {
    if (node === end)
        return true;

    if (node.nodeType == Node.ELEMENT_NODE)
        var element = /** @type {Element} */ (node);

    var found = false;

    if (element && callbacks.preorder) {
        if (!callbacks.preorder(element))
            return found;
    }

    // Descend into node:
    // If it has a ShadowRoot, ignore all child elements - these will be picked
    // up by the <content> or <shadow> elements. Descend straight into the
    // ShadowRoot.
    if (element) {
        // NOTE: grunt qunit DOES NOT support Shadow DOM, so if changing this
        // code, be sure to run the tests in the browser before committing.
        var shadowRoot = element.shadowRoot || element.webkitShadowRoot;
        if (shadowRoot) {
            found = axs.dom.composedTreeSearch(shadowRoot,
                                               end,
                                               callbacks,
                                               shadowRoot);
            if (element && callbacks.postorder && !found)
                callbacks.postorder(element);
            return found;
        }
    }

    // If it is a <content> element, descend into distributed elements - these
    // are elements from outside the shadow root which are rendered inside the
    // shadow DOM.
    if (element && element.localName == 'content') {
        var content = /** @type {HTMLContentElement} */ (element);
        var distributedNodes = content.getDistributedNodes();
        for (var i = 0; i < distributedNodes.length && !found; i++) {
            found = axs.dom.composedTreeSearch(distributedNodes[i],
                                                   end,
                                                   callbacks,
                                                   opt_shadowRoot);
        }
        if (element && callbacks.postorder && !found)
            callbacks.postorder.call(null, element);
        return found;
    }

    // If it is neither the parent of a ShadowRoot, a <content> element, nor
    // a <shadow> element recurse normally.
    var child = node.firstChild;
    while (child != null && !found) {
        found = axs.dom.composedTreeSearch(child,
                                           end,
                                           callbacks,
                                           opt_shadowRoot);
        child = child.nextSibling;
    }

    if (element && callbacks.postorder && !found)
        callbacks.postorder.call(null, element);
    return found;
};
