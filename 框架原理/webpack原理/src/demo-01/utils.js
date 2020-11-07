
this.utilField = '这是util.js模块的作用域'
this.testName = 'util.js'
exports.minus = function(a, b) {
    console.log('minus...this.testName...', this.testName);
    console.log('a * b = ', a * b)
}
