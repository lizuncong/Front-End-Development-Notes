const http = require('http')

const hostname = '127.0.0.1'

const port = 5001

const server = http.createServer((req, res) => {
    console.log(req.path)
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
})


server.listen(port, hostname, () => {
    console.log(`server running at http://${hostname}:${port}/`)
})
