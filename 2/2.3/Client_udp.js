const UDP = require('dgram');
const client = UDP.createSocket('udp4')
const text = "same_text=0"
let port = 8080;
const hostname = 'localhost'

client.on('message', (message, info) => {
  // get the information about server address, port, and size of packet received.

  console.log('Address: ', info.address, 'Port: ', info.port, 'Size: ', info.size)

  //read message from server

  let end = new Date();
  console.log('Message from server', message.toString())
  console.log("The total time it took to transfer data and receive it back:"
    + (end - start) + " millisecond")
  if (message.toString() == text) {
    console.log("+ returned what was sent");
  } else {
    console.log("- what was returned is not what was sent");
  }
  client.close()
})

const packet = Buffer.from(text)

let start;
client.send(packet, port, hostname, (err) => {
  start=new Date();
  if (err) {
    console.error('Failed to send packet !!')
  } else {
    console.log('Packet send !!')
  }
})
/*
let start;
let client = new net.Socket();
client.connect(port, () => {
  start = new Date();
  console.log('Connected');
  client.write(text);
})
let data = '';

client.on('data', (chunk) => {
  data += chunk;
});

client.on('close', () => {
  
});

client.on('error', (err) => {
  console.error(`Encountered an error trying to make a request: ${err.message}`);
});*/
