
this.utilField = '这是util.js模块的作用域'
this.testName = 'util.js'
export const minus = function(a, b) {
    console.log('minus...this.testName...', this.testName);
    console.log('a * b = ', a * b)
}

export const utilName = 'lzc'
