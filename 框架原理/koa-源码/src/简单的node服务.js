const http = require('http')

const hostname = '127.0.0.1'

const port = 5001

const server = http.createServer((req, res) => {
    console.log(res.statusCode, res.headersSent)
    console.log(req.method)
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
    console.log(res.statusCode, res.headersSent)
})


server.listen(port, hostname, () => {
    console.log(`server running at http://${hostname}:${port}/`)
})
