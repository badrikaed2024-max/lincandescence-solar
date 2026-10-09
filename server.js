const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    fs.readFile(filePath, (error, content) => {
        if (error) {
            fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data, 'utf-8');
            });
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(content, 'utf-8');
        }
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('Server running on port ' + port);
});
