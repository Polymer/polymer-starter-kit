/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
/**
* Finds and annotates the Polymer() and modulate() calls in javascript.
*/

'use strict';
import * as espree from 'espree';
import * as estree from 'estree';
import * as estraverse from 'estraverse';
import {behaviorFinder} from './behavior-finder';
import {elementFinder} from './element-finder';
import {featureFinder} from './feature-finder';
import {Visitor} from './fluent-traverse';

function traverse(visitorRegistries:Visitor[]):estraverse.Callbacks {
  function applyVisitors(name:string, node:estree.Node, parent:estree.Node) {
    for (const registry of visitorRegistries) {
      if (name in registry) {
        let returnVal = registry[name](node, parent);
        if (returnVal) {
          return returnVal;
        }
      }
    }
  }
  return {
    enter: function(node, parent) {
      return applyVisitors('enter' + node.type, node, parent);
    },
    leave: function(node, parent) {
      return applyVisitors('leave' + node.type, node, parent);
    },
    fallback: 'iteration',
  };
}

export function jsParse(jsString:string) {
  var script = espree.parse(jsString, {
    attachComment: true,
    comment: true,
    loc: true,
    ecmaVersion: 6
  });

  var featureInfo = featureFinder();
  var behaviorInfo = behaviorFinder();
  var elementInfo = elementFinder();

  var visitors = [featureInfo, behaviorInfo, elementInfo].map(function(info) {
    return info.visitors;
  });
  estraverse.traverse(script, traverse(visitors));

  return {
    behaviors: behaviorInfo.behaviors,
    elements:  elementInfo.elements,
    features:  featureInfo.features,
    parsedScript: script
  };
};
