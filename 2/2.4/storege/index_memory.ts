const express = require('express');
import bodyParser from "body-parser";
let jsonParser = bodyParser.json();

//import session from 'express-session'
const cors = require('cors');

type Tudushka = { id: number, text: String, checked: Boolean }
let saving_data = {
  items: new Map<number, Tudushka>(),
  n_id: 0
}
const port = 3005
const app = express()
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}))
app.get('/api/v1/items', (req: any, res: any) => {
  let resylt=new Array<Tudushka>;
  let tudushkas=saving_data.items.values();
  for (let tudushka of tudushkas){
    resylt.push(tudushka)
  }
  res.send({ items: resylt })
})
app.post('/api/v1/items', jsonParser, (req: any, res: any) => {
  saving_data.n_id++;
  saving_data.items.set(saving_data.n_id, { id: saving_data.n_id, text: req.body.text, checked: false })
  res.send({ id: saving_data.n_id })
})
app.put('/api/v1/items', jsonParser, (req: any, res: any) => {
  if (saving_data.items.has(req.body.id)) {
    saving_data.items.set(req.body.id, req.body);
    res.send({ "ok": true })
  } else {
    res.send({ "ok": false });
  }
})
app.delete('/api/v1/items', jsonParser, (req: any, res: any) => {
  if (saving_data.items.has(req.body.id)) {
    saving_data.items.delete(req.body.id)
    res.send({ "ok": true })
  } else {
    res.send({ "ok": false })
  }
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})