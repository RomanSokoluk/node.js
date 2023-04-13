var http = require('http');
var url = require('url');
let port = 8080;

const server = http.createServer().listen(port);
server.on('connection', function (sock) {
  console.log("-----Start sesion----->" + new Date().toUTCString());
  console.log('Client connected from ' + sock.remoteAddress);
  // Client address at time of connection ----^
});
server.on('request', function (req, res) {
  let start = new Date();
  let q = url.parse("http://" + req.rawHeaders[1] + "/" + req.url, true);
  let txt = q.path;
  txt = txt.slice(2); res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(txt);
  let end = new Date();
  console.log("The total time it took to transfer data and receive it back:"
    + (end - start) + " millisecond")
  console.log("-----End sesion----->" + new Date().toUTCString());
})
console.log(`Listening on port ${port}`);