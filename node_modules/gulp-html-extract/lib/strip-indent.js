"use strict";

var EOL = require("os").EOL;

/**
 * Strip "indentation" text starting at first non-whitespace character
 *
 * The use case here is that we want to take a snippet like:
 *
 * ```js
 * // There are two spaces before `var foo`
 *   var foo = true;
 *   if (foo) {
 *     bar = "hi"
 *   }
 * ```
 *
 * And apply a heuristic of "find the number of spaces on the first real line"
 * (here 2) and then "trim that number's worth of spaces everywhere" to produce:
 *
 * ```js
 * // There are no spaces before `var foo`
 * var foo = true;
 * if (foo) {
 *   bar = "hi"
 * }
 * ```
 *
 * The basic rules:
 * - Remove all empty lines before first real character.
 * - Capture whitespace on line of first real char up to the char.
 * - Remove prefix of that captured indent token up to char on all subsequent
 *   lines.
 * - Remove white-space only lines at the very end of the snippet.
 * - Adds final trailing newline if there is any real text in snippet.
 *
 * @param {String}    text  Text to strip
 * @returns {String}        Stripped text
 */
module.exports = function (text) {
  var indent = null;
  var hitRealChar = false;

  return (text || "")
    // Split into lines using Unix or Windows separator
    .split(/\r?\n/)

    // ------------------------------------------------------------------------
    // Remove starting whitespace lines, capture indent, remove indent
    // ------------------------------------------------------------------------
    // Capture indent and strip (1) intro blank lines, (2) dedent the indent
    .map(function (line) {
      // Capture initial indent.
      if (indent === null) {
        // Completely ignore initial whitespace before indent capture
        if (/^[ \t]*$/.test(line)) {
          return null;
        }

        // Otherwise, have initial indent.
        indent = /^[ \t]*/.exec(line)[0];
      }

      return line.replace(new RegExp("^" + indent), "");
    })
    // Remove initial empty lines
    .filter(function (line) { return line !== null; })

    // ------------------------------------------------------------------------
    // Remove ending whitespace lines
    // ------------------------------------------------------------------------
    // Reverse, remove trailing (now primary) empty lines, reverse back to
    // original
    .reverse()
    .map(function (line) {
      // Check if we've yet hit non-whitespace character
      hitRealChar = hitRealChar || /[^ \t]/.test(line);

      // Only return lines after real character
      return hitRealChar ? line : null;
    })
    .filter(function (line) { return line !== null; })
    .reverse()

    // Add final EOL if an actual character anywhere by pushing an extra
    // empty string. (We already know this from hitRealChar).
    .concat(hitRealChar ? [""] : [])

    // Rejoin to original using native EOL operator
    .join(EOL);
};
