const net = require('net');
let start;
const text = "same_text=0"
let port = 8080;
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
  let end = new Date();
  console.log("The total time it took to transfer data and receive it back:"
    + (end - start) + " millisecond")
  console.log('Retrieved all data:' + data);
  if (data == text) {
    console.log("+ returned what was sent");
  } else {
    console.log("- what was returned is not what was sent");
  }
});

client.on('error', (err) => {
  console.error(`Encountered an error trying to make a request: ${err.message}`);
});
