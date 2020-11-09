const c = 10

this.addField = '这是add.js模块的作用域'
this.testName = 'add.js';
this.code = '404'
export default function(a, b) {
    console.log('add...this.testName', this.testName);
    console.log('a + b = ', a + b + c);
}
