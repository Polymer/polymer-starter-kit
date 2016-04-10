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

import * as doctrine from 'doctrine';

/**
 * An annotated JSDoc block tag, all fields are optionally processed except for
 * the tag:
 *
 *     @TAG {TYPE} NAME DESC
 *
 * `line` and `col` indicate the position of the first character of text that
 * the tag was extracted from - relative to the first character of the comment
 * contents (e.g. the value of `desc` on a descriptor node). Lines are
 * 1-indexed.
 */
export interface Tag {
  tag: string;
  type?: string;
  name?: string;
  description?: string;
}

/**
 * The parsed representation of a JSDoc comment.
 */
export interface Annotation {
  description?: string;
  tags: Tag[];
  orig?: string;
}

/**
 * doctrine configuration,
 * CURRENTLY UNUSED BECAUSE PRIVATE
 */
// function configureDoctrine() {

//   // @hero [path/to/image]
//   doctrine.Rules['hero'] = ['parseNamePathOptional', 'ensureEnd'];

//   // // @demo [path/to/demo] [Demo title]
//   doctrine.Rules['demo'] = ['parseNamePathOptional', 'parseDescription', 'ensureEnd'];

//   // // @polymerBehavior [Polymer.BehaviorName]
//   doctrine.Rules['polymerBehavior'] = ['parseNamePathOptional', 'ensureEnd'];
// }
// configureDoctrine();

// @demo [path] [title]
function parseDemo(tag:doctrine.Tag):Tag {
  var match = (tag.description || "").match(/^\s*(\S*)\s*(.*)$/);
  return {
    tag: 'demo',
    type: null,
    name: match ? match[1] : null,
    description: match ? match[2] : null
  };
}

// @hero [path]
function parseHero(tag:doctrine.Tag):Tag {
  return {
    tag:  tag.title,
    type: null,
    name: tag.description,
    description: null
  };
}

// @polymerBehavior [name]
function parsePolymerBehavior(tag:doctrine.Tag):Tag {
  return {
    tag:  tag.title,
    type: null,
    name: tag.description,
    description: null
  };
}

// @pseudoElement name
function parsePseudoElement(tag:doctrine.Tag):Tag {
  return {
    tag:  tag.title,
    type: null,
    name: tag.description,
    description: null
  };
}

var CUSTOM_TAGS: {[name:string]: (tag:doctrine.Tag)=>Tag} = {
  demo: parseDemo,
  hero: parseHero,
  polymerBehavior: parsePolymerBehavior,
  pseudoElement: parsePseudoElement
};

/**
 * Convert doctrine tags to our tag format
 */
function _tagsToHydroTags(tags:doctrine.Tag[]):Tag[] {
  if (!tags)
    return null;
  return tags.map(function(tag):Tag {
    if (tag.title in CUSTOM_TAGS) {
      return CUSTOM_TAGS[tag.title](tag);
    }
    else {
      return {
        tag:  tag.title,
        type: tag.type ? doctrine.type.stringify(tag.type) : null,
        name: tag.name,
        description: tag.description,
      };
    }
  });
}

/**
 * removes leading *, and any space before it
 */
function _removeLeadingAsterisks(description:string):string {
  if ((typeof description) !== 'string')
    return description;

  return description
    .split('\n')
    .map(function(line) {
      // remove leading '\s*' from each line
      var match = line.match(/^[\s]*\*\s?(.*)$/);
      return match ? match[1] : line;
    })
    .join('\n');
}

/**
 * Given a JSDoc string (minus opening/closing comment delimiters), extract its
 * description and tags.
 *
 * @param {string} docs
 * @return {?Annotation}
 */
export function parseJsdoc(docs:string):Annotation {
  docs = _removeLeadingAsterisks(docs);
  var d = doctrine.parse(docs, {
    unwrap: false,
    lineNumber: true,
    preserveWhitespace: true
  });
  return {
    description: d.description,
    tags: _tagsToHydroTags(d.tags)
  };
}

// Utility

export function hasTag(jsdoc:Annotation, tagName:string):boolean {
  if (!jsdoc || !jsdoc.tags) return false;
  return jsdoc.tags.some(function(tag) { return tag.tag === tagName; });
}

/**
 * Finds the first JSDoc tag matching `name` and returns its value at `key`.
 *
 * If `key` is omitted, the entire tag object is returned.
 */
export function getTag(jsdoc:Annotation, tagName:string):Tag;
export function getTag(jsdoc:Annotation, tagName:string, key:string):string;
export function getTag(jsdoc:Annotation, tagName:string, key?:string):any {
  if (!jsdoc || !jsdoc.tags) return null;
  for (var i = 0; i < jsdoc.tags.length; i++) {
    var tag = jsdoc.tags[i];
    if (tag.tag === tagName) {
      return key ? tag[key] : tag;
    }
  }
  return null;
}

export function unindent(text:string):string {
  if (!text) return text;
  var lines  = text.replace(/\t/g, '  ').split('\n');
  var indent = lines.reduce<number>(function(prev, line) {
    if (/^\s*$/.test(line)) return prev;  // Completely ignore blank lines.

    var lineIndent = line.match(/^(\s*)/)[0].length;
    if (prev === null) return lineIndent;
    return lineIndent < prev ? lineIndent : prev;
  }, null);

  return lines.map(function(l) { return l.substr(indent); }).join('\n');
}
