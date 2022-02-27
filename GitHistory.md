### 目标
2022年开始，每年利用github提交记录构造`年份`图案，比如：

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/githistory.jpg)


### 过程
每天至少提交一次有意义的git记录。除了绘制图案的日期以外。
```html
<!doctype html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Git History</title>
        <style>
            #root {
                display: flex;
                flex-direction: column;
                height: 100px;
                overflow: hidden;
                flex-wrap: wrap;
            }
            .empty {
                width: 10px;
                height: 10px;
                margin: 0 4px 4px 0;
            }
            .date{
                width: 10px;
                height: 10px;
                margin: 0 4px 4px 0;
                background-color: green;
            }
        </style>
    </head>
    <body>
        <div id="root">
        </div>
    </body>
    <script>
        const root = document.getElementById('root')
        const monthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const dates = []
        const formatDate = (date) => {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const d = String(date.getDate()).padStart(2, '0')
            return `${year}-${month}-${d}`
        }
        const getZero = (startDate, dates) => {
            for(let i = 0; i<8; i++){
                startDate.setDate(startDate.getDate() + 7)
                dates.push(formatDate(startDate))
            }
            for(let i = 0; i < 4; i++){
                startDate.setDate(startDate.getDate() + 1)
                dates.push(formatDate(startDate)) 
            }
            for(let i = 0; i < 8; i++){
                startDate.setDate(startDate.getDate() - 7)
                dates.push(formatDate(startDate)) 
            }
            for(let i = 0; i < 4; i++){
                startDate.setDate(startDate.getDate() - 1)
                dates.push(formatDate(startDate)) 
            }
            return startDate
        }
        const getTwo = (startDate) => {
            for(let i = 0; i < 8; i++){
                startDate.setDate(startDate.getDate() + 7)
                dates.push(formatDate(startDate))
            }
            for(let i = 0; i < 2; i++){
                startDate.setDate(startDate.getDate() + 1)
                dates.push(formatDate(startDate))
            }
            for(let i = 0; i < 8; i++){
                startDate.setDate(startDate.getDate() - 7)
                dates.push(formatDate(startDate))
            }
            for(let i = 0; i < 2; i++){
                startDate.setDate(startDate.getDate() + 1)
                dates.push(formatDate(startDate))
            }
            for(let i = 0; i < 8; i++){
                startDate.setDate(startDate.getDate() + 7)
                dates.push(formatDate(startDate))
            }
            return startDate
        }
        // 画第一个数字2
        const startDate = new Date('2022-03-07')
        dates.push(formatDate(startDate))
        getTwo(startDate, dates)
        // 画第二个数字0
        startDate.setDate(startDate.getDate() - 4)
        startDate.setDate(startDate.getDate() + 21)
        getZero(startDate, dates)
        // 画第三个数字2
        startDate.setDate(startDate.getDate() + 77)
        dates.push(formatDate(startDate))
        getTwo(startDate, dates)
        // 画第四个数字2
        startDate.setDate(startDate.getDate() - 4)
        startDate.setDate(startDate.getDate() + 21)
        dates.push(formatDate(startDate))
        getTwo(startDate, dates)
        console.log(dates.sort())
        // 渲染面板
        const date = new Date('2022-01-01')
        const emptyBlocks = date.getDay()
        for(let i = 0; i < emptyBlocks; i++){
            const el = document.createElement('div')
            el.classList.add('empty')
            root.appendChild(el)
        }
        monthDay.forEach((days, index) => {
            const month = String(index + 1).padStart(2, '0');
            for(let i = 0; i < days; i ++){
                const date = '2022-' + month + '-' + String(i + 1).padStart(2, '0')
                const el = document.createElement('div')
                el.setAttribute('date', date)
                if(dates.includes(date)){
                    el.classList.add('empty')
                } else {
                    el.classList.add('date')
                }
                root.appendChild(el) 
            }
        })
    </script>
</html>
```

### 不能提交git记录的日期
```js
[
    "2022-03-07",
    "2022-03-09",
    "2022-03-10",
    "2022-03-11",
    "2022-03-14",
    "2022-03-16",
    "2022-03-18",
    "2022-03-21",
    "2022-03-23",
    "2022-03-25",
    "2022-03-28",
    "2022-03-30",
    "2022-04-01",
    "2022-04-04",
    "2022-04-06",
    "2022-04-08",
    "2022-04-11",
    "2022-04-13",
    "2022-04-15",
    "2022-04-18",
    "2022-04-20",
    "2022-04-22",
    "2022-04-25",
    "2022-04-27",
    "2022-04-29",
    "2022-05-02",
    "2022-05-03",
    "2022-05-04",
    "2022-05-06",
    "2022-05-23",
    "2022-05-24",
    "2022-05-25",
    "2022-05-26",
    "2022-05-27",
    "2022-05-30",
    "2022-06-03",
    "2022-06-06",
    "2022-06-10",
    "2022-06-13",
    "2022-06-17",
    "2022-06-20",
    "2022-06-24",
    "2022-06-27",
    "2022-07-01",
    "2022-07-04",
    "2022-07-08",
    "2022-07-11",
    "2022-07-15",
    "2022-07-18",
    "2022-07-19",
    "2022-07-20",
    "2022-07-21",
    "2022-07-22",
    "2022-08-08",
    "2022-08-10",
    "2022-08-11",
    "2022-08-12",
    "2022-08-15",
    "2022-08-17",
    "2022-08-19",
    "2022-08-22",
    "2022-08-24",
    "2022-08-26",
    "2022-08-29",
    "2022-08-31",
    "2022-09-02",
    "2022-09-05",
    "2022-09-07",
    "2022-09-09",
    "2022-09-12",
    "2022-09-14",
    "2022-09-16",
    "2022-09-19",
    "2022-09-21",
    "2022-09-23",
    "2022-09-26",
    "2022-09-28",
    "2022-09-30",
    "2022-10-03",
    "2022-10-04",
    "2022-10-05",
    "2022-10-07",
    "2022-10-24",
    "2022-10-26",
    "2022-10-27",
    "2022-10-28",
    "2022-10-31",
    "2022-11-02",
    "2022-11-04",
    "2022-11-07",
    "2022-11-09",
    "2022-11-11",
    "2022-11-14",
    "2022-11-16",
    "2022-11-18",
    "2022-11-21",
    "2022-11-23",
    "2022-11-25",
    "2022-11-28",
    "2022-11-30",
    "2022-12-02",
    "2022-12-05",
    "2022-12-07",
    "2022-12-09",
    "2022-12-12",
    "2022-12-14",
    "2022-12-16",
    "2022-12-19",
    "2022-12-20",
    "2022-12-21",
    "2022-12-23"]
```