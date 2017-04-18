var assert = require('assert');
var requireDir = require('..');

assert.deepEqual(requireDir('./camelcase', {
    recurse: true,
    camelcase: true
}), {
    aMain: 'a main',
    'a_main': 'a main',
    subDir: {
        aSub: 'a sub',
        'a-sub': 'a sub'
    },
    'sub-dir': {
        aSub: 'a sub',
        'a-sub': 'a sub'
    }
});

console.log('Camelcase tests passed.');
