var assert = require('assert');
var requireDir = require('..');

// first test without recursing:
assert.deepEqual(requireDir('./recurse'), {
    a: 'a',
});

// then test with recursing:
assert.deepEqual(requireDir('./recurse', {recurse: true}), {
    a: 'a',
    b: {
        '1': {
            foo: 'foo',
            bar: 'bar',
        },
        '2': {}     // note how the directory is always returned
    },
    c: {
        '3': 3
    },
    // note that node_modules was explicitly ignored
});

// finally, test that node_modules can still be required directly:
assert.deepEqual(requireDir('./recurse/node_modules'), {
    fake: 'fake',
});

console.log('Recurse tests passed.');
