const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  let name = "info.txt";
  let fs = require("fs");
  try {
    let text = fs.readFileSync(name, { encoding: 'utf8' });
  } catch {
    let text = "1"
  }
  res.send(text);
  let namber = Number.parseInt(text);
  namber++;
  text = namber + "";
  fs.writeFileSync(name, text);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})