import http from "node:http"

const PORT  = 8000

const server = http.createServer((req, res) => {
    res.end("example")
})

server.listen(PORT, () => console.log(`connetcion established on port ${PORT}`))