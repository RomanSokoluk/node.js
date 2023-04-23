"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const body_parser_1 = __importDefault(require("body-parser"));
const jsonParser = body_parser_1.default.json();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017";
// создаем объект MongoClient и передаем ему строку подключения
const mongoClient = new MongoClient(url);
//import session from 'express-session'
const cors = require('cors');
let getTudushkas = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("get->");
    let resyltTudushka = new Map();
    let resylt = [0, resyltTudushka];
    try {
        yield mongoClient.connect();
        const db = mongoClient.db("dataTudushkas");
        let collection = db.collection("Tudushkas");
        let arrayFiles = yield collection.find().toArray();
        for (let element of arrayFiles) {
            let tudushka = {
                id: Number(element._id),
                text: String(element.text),
                checked: element.checked
            };
            resyltTudushka.set(tudushka.id, tudushka);
        }
        collection = db.collection("TudushkasNamb");
        try {
            let namb = yield collection.find().toArray();
            resylt[0] = namb[0].Namb;
        }
        catch (err) {
            resylt[0] = 0;
        }
    }
    catch (err) {
        console.log(err);
    }
    finally {
        // Закрываем подключение при завершении работы или при ошибке
        yield mongoClient.close();
        console.log("<-get");
        return yield resylt;
    }
});
let setTudushkas = (resylt) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("set->");
    try {
        yield mongoClient.connect();
        let db = mongoClient.db("dataTudushkas");
        let collection = db.collection("Tudushkas");
        try {
            yield collection.drop();
        }
        catch (err) {
        }
        db = mongoClient.db("dataTudushkas");
        collection = db.collection("Tudushkas");
        let valueTudushkas = resylt[1].values();
        for (let element of valueTudushkas) {
            yield collection.insertOne({
                _id: element.id,
                text: element.text,
                checked: element.checked
            });
        }
        collection = db.collection("TudushkasNamb");
        try {
            yield collection.drop();
        }
        catch (err) {
        }
        collection = db.collection("TudushkasNamb");
        yield collection.insertOne({ Namb: resylt[0] });
    }
    catch (err) {
        console.log(err);
    }
    finally {
        // Закрываем подключение при завершении работы или при ошибке
        yield mongoClient.close();
        console.log("<-set");
    }
});
const port = 3005;
const app = express();
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));
app.get('/api/v1/items', (req, res) => {
    console.log("get-->");
    getTudushkas().then((results) => {
        return results[1].values();
    }).then((results) => {
        let result = [];
        for (let element of results) {
            result.push(element);
        }
        res.send({ items: result });
        console.log("<--get");
    });
});
app.post('/api/v1/items', jsonParser, (req, res) => {
    console.log("post-->");
    getTudushkas().then((Tudushkas) => {
        Tudushkas[0] = Tudushkas[0] + 1;
        Tudushkas[1].set(Tudushkas[0], { id: Tudushkas[0], text: req.body.text, checked: false });
        return Tudushkas;
    }).then((Tudushkas) => {
        setTudushkas(Tudushkas).then(() => {
            res.send({ id: Tudushkas[0] });
            console.log("<--post");
        });
    });
});
app.put('/api/v1/items', jsonParser, (req, res) => {
    console.log("put-->");
    getTudushkas().then((Tudushkas) => {
        let result = [false, Tudushkas];
        if (Tudushkas[1].has(req.body.id)) {
            Tudushkas[1].set(req.body.id, req.body);
            result[0] = true;
        }
        return result;
    }).then((result) => {
        setTudushkas(result[1]).then(() => {
            if (result[0]) {
                res.send({ "ok": true });
            }
            else {
                res.send({ "ok": false });
            }
            console.log("<--put");
        });
    });
});
app.delete('/api/v1/items', jsonParser, (req, res) => {
    getTudushkas().then((Tudushkas) => {
        let result = [false, Tudushkas];
        if (Tudushkas[1].has(req.body.id)) {
            Tudushkas[1].delete(req.body.id);
            result[0] = true;
        }
        return result;
    }).then((result) => {
        setTudushkas(result[1]).then(() => {
            if (result[0]) {
                res.send({ "ok": true });
            }
            else {
                res.send({ "ok": false });
            }
            console.log("<--put");
        });
    });
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
