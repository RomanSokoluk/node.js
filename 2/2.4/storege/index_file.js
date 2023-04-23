"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const body_parser_1 = __importDefault(require("body-parser"));
const fs = require("fs");
let jsonParser = body_parser_1.default.json();
//import session from 'express-session'
const cors = require('cors');
let nameFile = "save.txt";
let getTudushkas = () => {
    let resyltTudushka = new Map();
    let resylt = [0, resyltTudushka];
    try {
        let textTudushkas = fs.readFileSync(nameFile, { encoding: 'utf8' });
        textTudushkas = textTudushkas.split("\r\n");
        resylt[0] = Number(textTudushkas.pop());
        for (let textTudushka of textTudushkas) {
            let text = textTudushka.split(";");
            let tudushka = {
                id: Number(text[0]),
                text: String(text[1]),
                checked: text[2] != "false"
            };
            resyltTudushka.set(tudushka.id, tudushka);
        }
    }
    catch (_a) {
    }
    return resylt;
};
let setTudushkas = (resylt) => {
    try {
        let resylttext = "";
        let iterTudushkas = resylt[1].values();
        for (let Tudushka of iterTudushkas) {
            resylttext += Tudushka.id + ";" + Tudushka.text + ";" + Tudushka.checked + "\r\n";
        }
        resylttext += resylt[0];
        fs.writeFileSync(nameFile, resylttext);
    }
    catch (_a) {
    }
};
const port = 3005;
const app = express();
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));
app.get('/api/v1/items', (req, res) => {
    let results = getTudushkas()[1].values();
    let result = [];
    for (let element of results) {
        result.push(element);
    }
    res.send({ items: result });
});
app.post('/api/v1/items', jsonParser, (req, res) => {
    let Tudushkas = getTudushkas();
    Tudushkas[0] = Tudushkas[0] + 1;
    Tudushkas[1].set(Tudushkas[0], { id: Tudushkas[0], text: req.body.text, checked: false });
    setTudushkas(Tudushkas);
    res.send({ id: Tudushkas[0] });
});
app.put('/api/v1/items', jsonParser, (req, res) => {
    let Tudushkas = getTudushkas();
    if (Tudushkas[1].has(req.body.id)) {
        Tudushkas[1].set(req.body.id, req.body);
        res.send({ "ok": true });
        setTudushkas(Tudushkas);
    }
    else {
        res.send({ "ok": false });
    }
});
app.delete('/api/v1/items', jsonParser, (req, res) => {
    let Tudushkas = getTudushkas();
    if (Tudushkas[1].has(req.body.id)) {
        Tudushkas[1].delete(req.body.id);
        res.send({ "ok": true });
        setTudushkas(Tudushkas);
    }
    else {
        res.send({ "ok": false });
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
