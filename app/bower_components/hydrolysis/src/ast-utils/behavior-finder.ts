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
import * as docs from './docs';
import * as esutil from './esutil';
import * as jsdoc from './jsdoc';
import * as analyzeProperties from './analyze-properties';
import * as astValue from './ast-value';
import * as estree from 'estree';
import {Visitor} from './fluent-traverse';
import {declarationPropertyHandlers, PropertyHandlers} from './declaration-property-handlers';
import {BehaviorDescriptor, LiteralValue} from './descriptors';

interface KeyFunc<T> {
  (value: T): any;
}

function dedupe<T>(array: T[], keyFunc: KeyFunc<T>): T[] {
  var bucket = {};
  array.forEach((el) => {
    var key = keyFunc(el);
    if (key in bucket) {
      return;
    }
    bucket[key] = el;
  });
  var returned = <Array<T>>[];
  Object.keys(bucket).forEach((k) => {
    returned.push(bucket[k]);
  });
  return returned;
}

// TODO(rictic): turn this into a class.
export function behaviorFinder() {
  /** The behaviors we've found. */
  var behaviors: BehaviorDescriptor[] = [];

  var currentBehavior: BehaviorDescriptor = null;
  var propertyHandlers: PropertyHandlers = null;

  /**
   * merges behavior with preexisting behavior with the same name.
   * here to support multiple @polymerBehavior tags referring
   * to same behavior. See iron-multi-selectable for example.
   */
  function mergeBehavior(newBehavior: BehaviorDescriptor): BehaviorDescriptor {
    var isBehaviorImpl = (b:string) => {
      // filter out BehaviorImpl
      return b.indexOf(newBehavior.is) === -1;
    };
    for (var i=0; i<behaviors.length; i++) {
      if (newBehavior.is !== behaviors[i].is)
        continue;
      // merge desc, longest desc wins
      if (newBehavior.desc) {
        if (behaviors[i].desc) {
          if (newBehavior.desc.length > behaviors[i].desc.length)
            behaviors[i].desc = newBehavior.desc;
        }
        else {
          behaviors[i].desc = newBehavior.desc;
        }
      }
      // merge demos
      behaviors[i].demos = (behaviors[i].demos || []).concat(newBehavior.demos || []);
      // merge events,
      behaviors[i].events = (behaviors[i].events || []).concat(newBehavior.events || []);
      behaviors[i].events = dedupe(behaviors[i].events, (e) => {return e.name});
      // merge properties
      behaviors[i].properties = (behaviors[i].properties || []).concat(newBehavior.properties || []);
      // merge observers
      behaviors[i].observers = (behaviors[i].observers || []).concat(newBehavior.observers || []);
      // merge behaviors
      behaviors[i].behaviors =
        (behaviors[i].behaviors || []).concat(newBehavior.behaviors || [])
        .filter(isBehaviorImpl);
      return behaviors[i];
    }
    return newBehavior;
  }

  /**
   * gets the expression representing a behavior from a node.
   */
  function behaviorExpression(node:estree.Node): estree.Node {
    switch(node.type) {
      case 'ExpressionStatement':
        // need to cast to `any` here because ExpressionStatement is super
        // super general. this code is suspicious.
        return (<any>node).expression.right;
      case 'VariableDeclaration':
        const n = <estree.VariableDeclaration>node;
        return n.declarations.length > 0 ? n.declarations[0].init : null;
    }
  }

  /**
   * checks whether an expression is a simple array containing only member
   * expressions or identifiers.
   */
  function isSimpleBehaviorArray(expression: estree.Node): boolean {
    if (!expression || expression.type !== 'ArrayExpression') return false;
    const arrayExpr = <estree.ArrayExpression>expression;
    for (var i=0; i < arrayExpr.elements.length; i++) {
      if (arrayExpr.elements[i].type !== 'MemberExpression' &&
          arrayExpr.elements[i].type !== 'Identifier') {
        return false;
      }
    }
    return true;
  }

  var templatizer = "Polymer.Templatizer";

  function _parseChainedBehaviors(node: estree.Node) {
    // if current behavior is part of an array, it gets extended by other behaviors
    // inside the array. Ex:
    // Polymer.IronMultiSelectableBehavior = [ {....}, Polymer.IronSelectableBehavior]
    // We add these to behaviors array
    var expression = behaviorExpression(node);
    var chained:LiteralValue[] = [];
    if (expression && expression.type === 'ArrayExpression') {
      const arrExpr = <estree.ArrayExpression>expression;
      for (var i=0; i < arrExpr.elements.length; i++) {
        if (arrExpr.elements[i].type === 'MemberExpression' ||
            arrExpr.elements[i].type === 'Identifier') {
          chained.push(astValue.expressionToValue(arrExpr.elements[i]));
        }
      }
      if (chained.length > 0)
        currentBehavior.behaviors = chained;
    }
  }

  function _initBehavior(node: estree.Node, getName: ()=>string) {
    var comment = esutil.getAttachedComment(node);
    var symbol = getName();
    // Quickly filter down to potential candidates.
    if (!comment || comment.indexOf('@polymerBehavior') === -1) {
      if (symbol !== templatizer) {
        return;
      }
    }


    currentBehavior = {
      type: 'behavior',
      desc: comment,
      events: esutil.getEventComments(node).map( function(event) {
        return { desc: event};
      })
    };
    propertyHandlers = declarationPropertyHandlers(currentBehavior);

    docs.annotateBehavior(currentBehavior);
    // Make sure that we actually parsed a behavior tag!
    if (!jsdoc.hasTag(currentBehavior.jsdoc, 'polymerBehavior') &&
        symbol !== templatizer) {
      currentBehavior = null;
      propertyHandlers = null;
      return;
    }

    var name = jsdoc.getTag(currentBehavior.jsdoc, 'polymerBehavior', 'name');
    currentBehavior.symbol = symbol;
    if (!name) {
      name = currentBehavior.symbol;
    }
    if (!name) {
      console.warn('Unable to determine name for @polymerBehavior:', comment);
    }
    currentBehavior.is = name;

    _parseChainedBehaviors(node);

    currentBehavior = mergeBehavior(currentBehavior);
    propertyHandlers = declarationPropertyHandlers(currentBehavior);

    // Some behaviors are just lists of other behaviors. If this is one then
    // add it to behaviors right away.
    if (isSimpleBehaviorArray(behaviorExpression(node))) {
      // TODO(ajo): Add a test to confirm the presence of `properties`
      if (!currentBehavior.observers) currentBehavior.observers = [];
      if (!currentBehavior.properties) currentBehavior.properties = [];
      if (behaviors.indexOf(currentBehavior) === -1)
        behaviors.push(currentBehavior);
      currentBehavior = null;
      propertyHandlers = null;
    }
  }

  var visitors: Visitor = {

    /**
     * Look for object declarations with @behavior in the docs.
     */
    enterVariableDeclaration: function(node, parent) {
      if (node.declarations.length !== 1) return;  // Ambiguous.
      _initBehavior(node, function () {
        return esutil.objectKeyToString(node.declarations[0].id);
      });
    },

    /**
     * Look for object assignments with @polymerBehavior in the docs.
     */
    enterAssignmentExpression: function(node, parent) {
      _initBehavior(parent, function () {
        return esutil.objectKeyToString(node.left);
      });
    },

    /**
     * We assume that the object expression after such an assignment is the
     * behavior's declaration. Seems to be a decent assumption for now.
     */
    enterObjectExpression: function(node, parent) {
      if (!currentBehavior || currentBehavior.properties) return;

      currentBehavior.properties = currentBehavior.properties || [];
      currentBehavior.observers = currentBehavior.observers || [];
      for (var i = 0; i < node.properties.length; i++) {
        var prop = node.properties[i];
        var name = esutil.objectKeyToString(prop.key);
        if (!name) {
          throw {
            message: 'Cant determine name for property key.',
            location: node.loc.start
          };
        }
        if (name in propertyHandlers) {
          propertyHandlers[name](prop.value);
        }
        else {
          currentBehavior.properties.push(esutil.toPropertyDescriptor(prop));
        }
      }
      behaviors.push(currentBehavior);
      currentBehavior = null;
    },

  };

  return {visitors, behaviors};
};
