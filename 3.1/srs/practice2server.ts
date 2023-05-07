var http = require('http');
const fs = require("fs");
import { Request, Response } from 'express';
let port = 8081;
let nameFile = "practice2.html";
const server = http.createServer().listen(port, () => {
  console.log(`Listening on port ${port}`);
});
server.on('request', function (req: Request, res: Response) {
    res.end(fs.readFileSync(nameFile, { encoding: 'utf8' }));
})