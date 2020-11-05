
this.utilField = '这是util.js模块的作用域'
this.name = 'util.js'
exports.minus = (a, b) => {
    console.log('minus...this.name...', this.name);
    console.log('a * b = ', a * b)
}
