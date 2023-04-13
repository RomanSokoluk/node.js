var net = require('net');
let port = 8080;

const server = net.createServer((sock) => {
  let start = new Date();
  console.log("-----Start sesion----->" + new Date().toUTCString());
  console.log('Client connected from ' + sock.remoteAddress);
  // Client address at time of connection ----^

  sock.on('data', function (data) {
    console.log('Received: ' + data);
    sock.write(data);
    sock.end(); 
  });

  sock.on('close', function () {
    let end = new Date();
    console.log('Connection closed');
  console.log("The total time it took to transfer data and receive it back:"
    + (end - start) + " millisecond")
  console.log("-----End sesion----->" + new Date().toUTCString());
  });
}

).listen(port,()=>{console.log(`Listening on port ${port}`)});

