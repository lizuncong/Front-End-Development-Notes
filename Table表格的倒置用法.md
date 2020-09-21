以 `antd` 的 `Table` 表格组件举例。

在我们遇到的大部分业务场景中，表格的使用都是遵循以下的用法：

```jsx
const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];

<Table dataSource={dataSource} columns={columns} />;
```
效果如下：

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/table-01.jpg)

假设现在有如下需求：

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/table-02.jpg)

如上图所示，尺码列数不固定，即有多少列尺码需要后端返回给前端。然后尺码的下单数可以输入填写

同时统计总数。此时后端返回的columns和dataSource理论上应该要满足如下代码所示：

```jsx
import React, { memo } from 'react';
import { Table, Input } from 'antd';

const columnsFromServer = [ // 理论上，后端返回给前端的列应该类似这样，告诉前端几列。
  {
    title: 'L',
  },
  {
    title: 'XL',
  },
  {
    title: 'XXL',
  },
];
const dataSource = [ // 理论上，后端返回给前端的数据源应该长这样
  {
    sizeName: '下单数',
    total: 30,
    L: 12,
    XL: 8,
    XXL: 10,
  },
  {
    sizeName: '库存数',
    total: 40,
    L: 16,
    XL: 14,
    XXL: 10,
  },
];

const columns = [
  {
    title: '尺码',
    dataIndex: 'sizeName',
  },
  {
    title: '总数',
    dataIndex: 'total',
  },
  ...columnsFromServer.map((col) => (
    {
      title: col.title,
      render: (text, record, index) => (index ? record[col.title] : (
        <Input
          value={record[col.title]}
          onChange={(e) => {
            record[col.title] = e.target.value;
          }}
        />
      )),
    }
  )),
];

const Index = memo(() => (
  <Table dataSource={dataSource} columns={columns} />
));

```

很明显，如果后端按照这个格式返回数据，前端渲染就非常方便了。但现实情况是，这样的数据结构其实对后端不友好。因为后端

存储数据时，肯定是按照尺码存储的，因此读数据时，也是按尺码读的，比如：

```jsx
const data = [
  {
    sizeName: 'L', // 尺码
    orderNum: 12, // 下单数
    stockNum: 16, // 库存数
  },
  {
    sizeName: 'XL', // 尺码
    orderNum: 8, // 下单数
    stockNum: 14, // 库存数
  },
  {
    sizeName: 'XXL', // 尺码
    orderNum: 10, // 下单数
    stockNum: 10, // 库存数
  },
];
```

后端按照这个格式返回给前端，也合情合理。就省了转换成前端需要的数据的麻烦。但是很明显，这个数据转换的工作量

就转移到前端开发的人员身上。因此，这个问题 ***本质上就是前端或者后端谁转换数据格式的问题***。如果是前端转换，需要这么做：

```jsx
// 真实情况下，后端返回的数据结构
const data = [
  {
    sizeName: 'L', // 尺码
    orderNum: 20, // 下单数
    stockNum: 32, // 库存数
  },
  {
    sizeName: 'XL', // 尺码
    orderNum: 28, // 下单数
    stockNum: 26, // 库存数
  },
  {
    sizeName: 'XXL', // 尺码
    orderNum: 19, // 下单数
    stockNum: 56, // 库存数
  },
];

// 根据data构造Table的columns
const columns = [
  {
    title: '尺码',
    dataIndex: 'sizeName',
  },
  {
    title: '总数',
    dataIndex: 'total',
  },
  ...data.map((col) => (
    {
      title: col.sizeName,
      render: (text, record, index) => (index ? record[col.sizeName] : (
        <Input
          value={record[col.sizeName]}
          onChange={(e) => {
            record[col.sizeName] = e.target.value;
          }}
        />
      )),
    }
  )),
];

// 然后还需要根据data构造Table的dataSource
const dataSource = [
  {
    sizeName: '下单数',
  },
  {
    sizeName: '库存数',
  },
];

data.forEach((item) => {
  const orderObj = dataSource[0]; // 第一行数据，下单数
  orderObj[item.sizeName] = item.orderNum;
  orderObj.total = (orderObj.total || 0) + Number(item.orderNum); // 计算总数
  const stockObj = dataSource[1]; // 第二行数据，库存数
  stockObj[item.sizeName] = item.stockNum;
  stockObj.total = (stockObj.total || 0) + Number(item.stockNum); // 计算总数
});

const Index = memo(() => (
  <Table dataSource={dataSource} columns={columns} />
));

```

可以看出前端转换数据，不难。但是繁琐且麻烦且没技术难点。但还是很影响开发效率。而且最后输入的下单数还需要再转换成

后端需要的格式，再传回给后端，那这时就又需要从dataSource里转换成data的形式：

```jsx
// 需要根据datasource构造后端需要的数据结构
const dataToServer = [
  {
    sizeName: 'L', // 尺码
    orderNum: 20, // 下单数
  },
  {
    sizeName: 'XL', // 尺码
    orderNum: 28, // 下单数
  },
  {
    sizeName: 'XXL', // 尺码
    orderNum: 19, // 下单数
  },
]; // 传回给后端的数据

```

这种数据转换来转换去确实麻烦且比较容易出错。
