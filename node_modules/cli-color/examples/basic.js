'use strict';

var clc = require('../');

console.log('Output colored text:');
console.log(clc.red('Text in red'));

console.log('Styles can be mixed:');
console.log(clc.red.bgWhite.underline('Underlined red text on white background.'));

console.log('Styled text can be mixed with unstyled:');
console.log(clc.red('red') + ' plain ' + clc.blue('blue'));

console.log('Styled text can be nested:');
console.log(clc.red('red ' + clc.blue('blue') + ' red'));

console.log('Best way is to predefine needed stylings and then use it:');

var error = clc.red.bold;
var warn = clc.yellow;
var notice = clc.blue;

console.log(error('Error!'));
console.log(warn('Warning'));
console.log(notice('Notice'));
