import  express, {Request, Response} from 'express';
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const cors = require('cors');
import { f_get, f_post, f_put, f_delete, f_register, f_login, 
  f_logout } from "./funtion"

const port = 3005
const app = express()
app.use(
  session({
    secret: 'keyboard cat',
    store: new FileStore({}),
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1000ms*60sec*60min*24h 
    },
  })
);
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/api/v1/items', f_get)
app.post('/api/v1/items', jsonParser, f_post)
app.put('/api/v1/items', jsonParser, f_put)
app.delete('/api/v1/items', jsonParser, f_delete)
app.post('/api/v1/register', jsonParser, f_register)
app.post('/api/v1/login', jsonParser, f_login)
app.post('/api/v1/logout', jsonParser, f_logout)
app.post('/api/v2/router', jsonParser, (req: Request, res: Response) => {
  switch (req.query.action) {
    case "login":
      f_login(req, res);
      break;
    case "logout":
      f_logout(req, res);
      break;
    case "register":
      f_register(req, res);
      break;
    case "getItems":
      f_get(req, res);
      break;
    case "deleteItem":
      f_delete(req, res);
      break;
    case "createItem":
      f_post(req, res);
      break;
    case "editItem":
      f_put(req, res);
      break;
  };
})