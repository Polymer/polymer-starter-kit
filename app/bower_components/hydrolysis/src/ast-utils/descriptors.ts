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
import * as jsdoc from './jsdoc';
import * as dom5 from 'dom5';

export type LiteralValue = string|number|boolean|RegExp;

export interface Descriptor {
  jsdoc?: jsdoc.Annotation;
  desc?: string;
}

export interface PropertyDescriptor extends Descriptor {
  name: string,
  type: string,
  desc: string,
  javascriptNode: estree.Node;
  params?: {name: string}[];
  published?: boolean;
  notify?: LiteralValue;
  observer?: LiteralValue;
  observerNode?: estree.Expression;
  readOnly?: LiteralValue;
  reflectToAttribute?: LiteralValue;
  default?: LiteralValue;
  private?: boolean;
  configuration?: boolean;
  getter?: boolean;
  setter?: boolean;

  __fromBehavior?: BehaviorOrName;
}

/**
 * The metadata for a single polymer element
 */
export interface ElementDescriptor extends Descriptor {
  is?: string;
  contentHref?: string;
  properties?: PropertyDescriptor[];
  observers?: {
    javascriptNode: estree.Expression | estree.SpreadElement,
    expression: LiteralValue
  }[];
  behaviors?: BehaviorOrName[];

  type: string; // 'element' | 'behavior'
  demos?: {
    desc: string;
    path: string;
  }[];
  events?: EventDescriptor[];
  hero?: string;
  domModule?: dom5.Node;
  scriptElement?: dom5.Node;

  abstract?: boolean;
}

/**
 * The metadata for a Polymer behavior mixin.
 */
export interface BehaviorDescriptor extends ElementDescriptor {
  symbol?: string;
}

export interface EventDescriptor extends Descriptor {
  name?: string;
  __fromBehavior?: BehaviorOrName;
  params?: {
    type: string,
    desc: string,
    name: string
  }[];
}

type BehaviorOrName = LiteralValue|BehaviorDescriptor;

export interface FunctionDescriptor extends PropertyDescriptor {
  function: boolean; // true
  return: {
    type: string;
    desc: string;
  };
}

/**
 * The metadata for a Polymer feature.
 */
export interface FeatureDescriptor extends ElementDescriptor {

}

export type BehaviorsByName = {[name: string]: BehaviorDescriptor};
