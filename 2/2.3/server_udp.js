var UDP = require('dgram');
let port = 8080;
const server = UDP.createSocket('udp4');
server.on('listening', () => {
  // Server address it’s using to listen
  const address = server.address()
  console.log('Listining to ', 'Address: ', address.address, 'Port: ', address.port)
})
server.on('message', (message, info) => {
  let start = new Date();
  console.log("-----Start----->" + new Date().toUTCString());
  console.log('Message', message.toString())

  //sending back response to client

  server.send(message, info.port, info.address, (err) => {
    if (err) {
      console.error('Failed to send response !!')
    } else {
      console.log('Response send Successfully')
    }
  let end = new Date();
  console.log("The total time it took to transfer data and receive it back:"
    + (end - start) + " millisecond")
  console.log("-----End----->" + new Date().toUTCString());
  })
})
server.bind(port)
