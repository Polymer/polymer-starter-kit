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

import * as estree from 'estree';
import {LiteralValue} from './descriptors';

// useful tool to visualize AST: http://esprima.org/demo/parse.html

/**
 * converts literal: {"type": "Literal", "value": 5,  "raw": "5" }
 * to string
 */
function literalToValue(literal: estree.Literal): LiteralValue {
  return literal.value;
}

/**
 * converts unary to string
 */
function unaryToValue(unary: estree.UnaryExpression):string {
  var argValue = expressionToValue(unary.argument);
  if (argValue === undefined)
    return;
  return unary.operator + argValue;
}

/**
 * converts identifier to its value
 * identifier { "type": "Identifier", "name": "Number }
 */
function identifierToValue(identifier: estree.Identifier):string {
  return identifier.name;
}

/**
 * Function is a block statement.
 */
function functionDeclarationToValue(
    fn: estree.FunctionDeclaration): LiteralValue {
  if (fn.body.type == "BlockStatement")
    return blockStatementToValue(fn.body);
}

function functionExpressionToValue(
    fn: estree.FunctionExpression): LiteralValue {
  if (fn.body.type == "BlockStatement")
    return blockStatementToValue(fn.body);
}
/**
 * Block statement: find last return statement, and return its value
 */
function blockStatementToValue(
    block: estree.BlockStatement): LiteralValue {
  for (var i=block.body.length - 1; i>= 0; i--) {
    if (block.body[i].type === "ReturnStatement")
      return returnStatementToValue(<estree.ReturnStatement>block.body[i]);
  }
}

/**
 * Evaluates return's argument
 */
function returnStatementToValue(ret: estree.ReturnStatement): LiteralValue {
  return expressionToValue(ret.argument);
}

/**
 * Enclose containing values in []
 */
function arrayExpressionToValue(arry: estree.ArrayExpression): string {
  var value = '[';
  for (var i=0; i<arry.elements.length; i++) {
    var v = expressionToValue(arry.elements[i]);
    if (v === undefined)
      continue;
    if (i !== 0)
      value += ', ';
    value += v;
  }
  value += ']';
  return value;
}

/**
 * Make it look like an object
 */
function objectExpressionToValue(obj: estree.ObjectExpression): string {
  var value = '{';
  for (var i=0; i<obj.properties.length; i++) {
    var k = expressionToValue(obj.properties[i].key);
    var v = expressionToValue(obj.properties[i].value);
    if (v === undefined)
      continue;
    if (i !== 0)
      value += ', ';
    value += '"' + k + '": ' + v;
  }
  value += '}';
  return value;
}

/**
 * BinaryExpressions are of the form "literal" + "literal"
 */
function binaryExpressionToValue(
    member: estree.BinaryExpression): number|string {
  if (member.operator == "+") {
    // We need to cast to `any` here because, while it's usually not the right
    // thing to do to use '+' on two values of a mix of types because it's
    // unpredictable, that is what the original code we're evaluating does.
    return <any>expressionToValue(member.left) + expressionToValue(member.right);
  }
  return;
}

/**
 * MemberExpression references a variable with name
 */
function memberExpressionToValue(member: estree.MemberExpression): string {
  return expressionToValue(member.object) + "." + expressionToValue(member.property);
}

/**
 * Tries to get the value of an expression. Returns undefined on failure.
 */
export function expressionToValue(valueExpression: estree.Node): LiteralValue {
  switch(valueExpression.type) {
    case 'Literal':
      return literalToValue(<estree.Literal>valueExpression);
    case 'UnaryExpression':
      return unaryToValue(<estree.UnaryExpression>valueExpression);
    case 'Identifier':
      return identifierToValue(<estree.Identifier>valueExpression);
    case 'FunctionDeclaration':
      return functionDeclarationToValue(<estree.FunctionDeclaration>valueExpression);
    case 'FunctionExpression':
      return functionExpressionToValue(<estree.FunctionExpression>valueExpression);
    case 'ArrayExpression':
      return arrayExpressionToValue(<estree.ArrayExpression>valueExpression);
    case 'ObjectExpression':
      return objectExpressionToValue(<estree.ObjectExpression>valueExpression);
    case 'Identifier':
      return identifierToValue(<estree.Identifier>valueExpression);
    case 'MemberExpression':
      return memberExpressionToValue(<estree.MemberExpression>valueExpression);
    case 'BinaryExpression':
      return binaryExpressionToValue(<estree.BinaryExpression>valueExpression);
    default:
      return;
  }
}

export var CANT_CONVERT = 'UNKNOWN';
