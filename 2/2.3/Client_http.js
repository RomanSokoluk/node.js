const http = require('http');
let start = new Date();
const text = "?same_text=0"
let request = http.get(`http://localhost:8080/${text}`, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Did not get an OK from the server. Code: ${res.statusCode}`);
    res.resume();
    return;
  }

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('close', () => {
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
});
request.on('error', (err) => {
  console.error(`Encountered an error trying to make a request: ${err.message}`);
});