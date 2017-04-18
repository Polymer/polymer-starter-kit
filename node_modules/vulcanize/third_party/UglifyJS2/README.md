# Contents
Slim copy of [UglifyJS2](https://github.com/mishoo/UglifyJS2) output library.

# Original Copy
https://raw.githubusercontent.com/mishoo/UglifyJS2/v2.6.1/lib/output.js

# Modifications

- Removed all functions except `encode_string`.
- Replaced call `var ret = make_string(str, quote)` with `var ret = str`
- Added default `options` object
- Added CommonJS `module.exports` line
- Added `jshint` settins line
- Removed semicolon from defintion of `encode_string`
- Escape scripts with `\x3c/script` syntax

# License
BSD-2-Clause: [License](https://raw.githubusercontent.com/mishoo/UglifyJS2/v2.6.1/LICENSE)
