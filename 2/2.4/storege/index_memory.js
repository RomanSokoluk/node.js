"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const body_parser_1 = __importDefault(require("body-parser"));
let jsonParser = body_parser_1.default.json();
//import session from 'express-session'
const cors = require('cors');
let saving_data = {
    items: new Map(),
    n_id: 0
};
const port = 3005;
const app = express();
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));
app.get('/api/v1/items', (req, res) => {
    let resylt = new Array;
    let tudushkas = saving_data.items.values();
    for (let tudushka of tudushkas) {
        resylt.push(tudushka);
    }
    res.send({ items: resylt });
});
app.post('/api/v1/items', jsonParser, (req, res) => {
    saving_data.n_id++;
    saving_data.items.set(saving_data.n_id, { id: saving_data.n_id, text: req.body.text, checked: false });
    res.send({ id: saving_data.n_id });
});
app.put('/api/v1/items', jsonParser, (req, res) => {
    if (saving_data.items.has(req.body.id)) {
        saving_data.items.set(req.body.id, req.body);
        res.send({ "ok": true });
    }
    else {
        res.send({ "ok": false });
    }
});
app.delete('/api/v1/items', jsonParser, (req, res) => {
    if (saving_data.items.has(req.body.id)) {
        saving_data.items.delete(req.body.id);
        res.send({ "ok": true });
    }
    else {
        res.send({ "ok": false });
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
