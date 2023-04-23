const express = require('express');
import bodyParser from "body-parser";
const fs = require("fs");
let jsonParser = bodyParser.json();

//import session from 'express-session'
const cors = require('cors');

type Tudushka = { id: number, text: String, checked: Boolean }
let nameFile = "save.txt";
let getTudushkas=()=>{
  let resyltTudushka = new Map<number, Tudushka>();
  let resylt:[number,Map<number, Tudushka>] = [0,resyltTudushka];
  try {
    let textTudushkas = fs.readFileSync(nameFile, { encoding: 'utf8' });
    textTudushkas = textTudushkas.split("\r\n");
    resylt[0]=Number(textTudushkas.pop());
    for (let textTudushka of textTudushkas) {
      let text = textTudushka.split(";");
      let tudushka = {
        id: Number(text[0]),
        text: String(text[1]),
        checked: text[2]!="false" 
      }
      resyltTudushka.set(tudushka.id,tudushka)
    }
  } catch {
  }
  return resylt;
}
let setTudushkas=(resylt:[number,Map<number, Tudushka>])=>{
  try {
    let resylttext = "";
    let iterTudushkas=resylt[1].values()
    for (let Tudushka of iterTudushkas) {
      resylttext+=Tudushka.id+";"+Tudushka.text+";"+ Tudushka.checked+"\r\n";
    }
    resylttext+=resylt[0];
    fs.writeFileSync(nameFile, resylttext);
  } catch {
  }
}
const port = 3005
const app = express()
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}))
app.get('/api/v1/items', (req: any, res: any) => {
  let results=getTudushkas()[1].values()
  let result=[];
  for (let element of results){
    result.push(element)
  }
  res.send({ items: result })
})
app.post('/api/v1/items', jsonParser, (req: any, res: any) => {
  let Tudushkas=getTudushkas()
  Tudushkas[0]=Tudushkas[0]+1;
  Tudushkas[1].set(Tudushkas[0],{ id: Tudushkas[0], text: req.body.text, checked: false })
  setTudushkas(Tudushkas);
  res.send({ id: Tudushkas[0] })
})
app.put('/api/v1/items', jsonParser, (req: any, res: any) => {
  let Tudushkas=getTudushkas()
  if (Tudushkas[1].has(req.body.id)) {
    Tudushkas[1].set(req.body.id, req.body);
    res.send({ "ok": true })
    setTudushkas(Tudushkas);
  } else {
    res.send({ "ok": false });
  }
})
app.delete('/api/v1/items', jsonParser, (req: any, res: any) => {
  let Tudushkas=getTudushkas()
  if (Tudushkas[1].has(req.body.id)) {
    Tudushkas[1].delete(req.body.id)
    res.send({ "ok": true })
    setTudushkas(Tudushkas);
  } else {
    res.send({ "ok": false })
  }
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})