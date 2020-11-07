const add = require('./add');
const { minus } = require('./utils');

this.indexField = '这是index.js模块的作用域';
this.testName = 'index.js';
console.log('this...in..index.js', this);
add(3 , 4);
minus(4, 5);
