import express, { Request, Response } from 'express';
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const cors = require('cors');
const port = 3005
const app = express()
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081'],
  credentials: true
}))
app.post('/st', jsonParser, (req: Request, res: Response) => {
  if (req.body.button == 1) {
    data.presed1 ++
  } else {
    data.presed2 ++
  }
  enum Direction1 {
    presed1=data.presed1,
    presed2=data.presed2
  }
  console.log(req.body)
  res.send(Direction1)
})
let data={
  presed1:0,
  presed2:0,
}