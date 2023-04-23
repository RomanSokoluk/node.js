const express = require('express');
import bodyParser from "body-parser";
const jsonParser = bodyParser.json();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017";
// создаем объект MongoClient и передаем ему строку подключения
const mongoClient = new MongoClient(url);
//import session from 'express-session'
const cors = require('cors');

type Tudushka = { id: number, text: String, checked: Boolean }
let getTudushkas = async () => {
  console.log("get->")
  let resyltTudushka = new Map<number, Tudushka>();
  let resylt: [number, Map<number, Tudushka>] = [0, resyltTudushka];
  try {
    await mongoClient.connect()
    const db = mongoClient.db("dataTudushkas");
    let collection = db.collection("Tudushkas");
    let arrayFiles: Array<{
      _id: number, text: String,
      checked: Boolean
    }> = await collection.find().toArray();
    for (let element of arrayFiles) {
      let tudushka = {
        id: Number(element._id),
        text: String(element.text),
        checked: element.checked
      }
      resyltTudushka.set(tudushka.id, tudushka)
    }
    collection = db.collection("TudushkasNamb");
    try {
      let namb = await collection.find().toArray()
      resylt[0] = namb[0].Namb;
    } catch (err) {
      resylt[0] = 0;
    }
  } catch (err) {
    console.log(err)
  } finally {
    // Закрываем подключение при завершении работы или при ошибке
    await mongoClient.close();
    console.log("<-get")
    return await resylt;
  }
}
let setTudushkas = async (resylt: [number, Map<number, Tudushka>]) => {
  console.log("set->")
  try {
    await mongoClient.connect()
    let db = mongoClient.db("dataTudushkas");
    let collection = db.collection("Tudushkas");
    try {
      await collection.drop();
    } catch (err) {
    }
    db = mongoClient.db("dataTudushkas");
    collection = db.collection("Tudushkas");
    let valueTudushkas = resylt[1].values();
    for (let element of valueTudushkas) {
      await collection.insertOne({
        _id: element.id,
        text: element.text,
        checked: element.checked
      });
    }
    collection = db.collection("TudushkasNamb");
    try {
      await collection.drop();
    } catch (err) {
    }
    collection = db.collection("TudushkasNamb");
    await collection.insertOne({ Namb: resylt[0] })
  } catch (err) {
    console.log(err)
  }
  finally {
    // Закрываем подключение при завершении работы или при ошибке
    await mongoClient.close();
    console.log("<-set")
  }
}
const port = 3005
const app = express()
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}))
app.get('/api/v1/items', (req: any, res: any) => {
  console.log("get-->")
  getTudushkas().then((results) => {
    return results[1].values()
  }
  ).then((results) => {
    let result = [];
    for (let element of results) {
      result.push(element)
    }
    res.send({ items: result })
    console.log("<--get")
  })
})
app.post('/api/v1/items', jsonParser, (req: any, res: any) => {
  console.log("post-->")
  getTudushkas().then((Tudushkas) => {
    Tudushkas[0] = Tudushkas[0] + 1;
    Tudushkas[1].set(Tudushkas[0], { id: Tudushkas[0], text: req.body.text, checked: false })
    return Tudushkas
  }).then((Tudushkas) => {
    setTudushkas(Tudushkas).then(() => {
      res.send({ id: Tudushkas[0] })
      console.log("<--post")
    });
  })
})
app.put('/api/v1/items', jsonParser, (req: any, res: any) => {
  console.log("put-->")
  getTudushkas().then((Tudushkas) => {
    let result: [Boolean, [number, Map<number, Tudushka>]] = [false, Tudushkas];
    if (Tudushkas[1].has(req.body.id)) {
      Tudushkas[1].set(req.body.id, req.body);
      result[0] = true
    }
    return result
  }).then((result) => {
    setTudushkas(result[1]).then(() => {
      if (result[0]) {
        res.send({ "ok": true })
      } else {
        res.send({ "ok": false });
      }
      console.log("<--put")
    });
  })
})
app.delete('/api/v1/items', jsonParser, (req: any, res: any) => {
  getTudushkas().then((Tudushkas) => {
    let result: [Boolean, [number, Map<number, Tudushka>]] = [false, Tudushkas];
    if (Tudushkas[1].has(req.body.id)) {
      Tudushkas[1].delete(req.body.id)
      result[0] = true
    } return result
  }).then((result) => {
    setTudushkas(result[1]).then(() => {
      if (result[0]) {
        res.send({ "ok": true })
      } else {
        res.send({ "ok": false });
      }
      console.log("<--put")
    });
  })
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})