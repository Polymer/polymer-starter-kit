/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

'use strict';

import * as estraverse from 'estraverse';
import * as esutil from './esutil';
import {FeatureDescriptor} from './descriptors';
import {Visitor} from './fluent-traverse';
import * as estree from 'estree';

var numFeatures = 0;

export function featureFinder() {
  /** The features we've found. */
  var features: FeatureDescriptor[] = [];

  function _extractDesc(
      feature:FeatureDescriptor, node:estree.CallExpression,
      parent: estree.Node) {
    feature.desc = esutil.getAttachedComment(parent);
  }

  function _extractProperties(
      feature:FeatureDescriptor, node:estree.CallExpression,
      parent: estree.Node) {
    var featureNode = node.arguments[0];
    if (featureNode.type !== 'ObjectExpression') {
      console.warn(
          'Expected first argument to Polymer.Base._addFeature to be an object.',
          'Got', featureNode.type, 'instead.');
      return;
    }
    const objExpr = <estree.ObjectExpression>featureNode;
    if (!objExpr.properties) return;

    feature.properties = objExpr.properties.map(esutil.toPropertyDescriptor);
  }

  var visitors: Visitor = {

    enterCallExpression: function enterCallExpression(node, parent) {
      const isAddFeatureCall = esutil.matchesCallExpression(
            <estree.MemberExpression>node.callee,
            ['Polymer', 'Base', '_addFeature']);
      if (!isAddFeatureCall) {
        return;
      }
      /** @type {!FeatureDescriptor} */
      var feature = <FeatureDescriptor>{};
      _extractDesc(feature, node, parent);
      _extractProperties(feature, node, parent);

      features.push(feature);
    },
  };

  return {visitors: visitors, features: features};
};
