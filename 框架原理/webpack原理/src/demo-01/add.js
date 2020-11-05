const c = 10

this.addField = '这是add.js模块的作用域'
this.name = 'add.js';

module.exports = (a, b) => {
    console.log('add...this.name', this.name);
    console.log('a + b = ', a + b + c);
}
