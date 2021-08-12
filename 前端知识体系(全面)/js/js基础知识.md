### Number
- NaN和任何东西都不想等，包括自身。NaN === NaN false
- isNaN。底层机制上，isNaN接收的参数不是数字类型的话，就会调用Number()方法进行转换，然后再次判断。简单点看，isNaN调用的就是Number()方法
    + isNaN('10')，isNaN(true)，isNaN([])，isNaN([12])
- Number()。底层机制上，先将参数调用toString()转换成字符串，再进行数字转换。比如[12,23].toString()。规则：字符串中只能包含数字和最多一个小数点，如果包含其他字符，则直接返回NaN。
    + Number(null)，Number(undefined), Number([12]), Number(true)
- parseInt，parseFloat。底层上，也是先将参数调用toString转换成字符串，再解析成对应的数字类型。规则：字符串第一个如果不是数字，则直接返回NaN。否则从第一个字符开始到第一个非数字字符。
    + parseInt(''), parseFloat(''), parseInt('12.323pxs'), parseInt(true)
- 注意parseInt和parseFloat以及Number在对true和false转换的区别。