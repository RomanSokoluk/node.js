const fs = require("fs");
import express, { Request, Response } from 'express';
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const session = require('express-session')
const FileStore = require('session-file-store')(session);
import { getBoks2, getBook2, chengeBook2, addBook2, deletBook2, notDeletBook2}
  from "./function_BD_v2"
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
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
declare module 'express-session' {
  export interface SessionData {
    login: string,
    pass: string
  }
}
//Константи з іменами файлів
const picture = "imege/base.png";
const stylesFile = "html/styles_3_2.css";
//----V2
const nameFile_books_page_v2 = "html/v2/books-page_v2.html";
const scriptFile_v2 = "dist/myscript3_2_html_v2.js";
const nameFile_book_page_v2 = "html/v2/book-page_v2.html";
const nameFile_admin_v2 = "html/v2/admin_v2.html";
const nameFile_authorization_v2 = "html/v2/authorization_v2.html";
//Сторінка з книгами
app.get('/api/v2/', (req: Request, res: Response) => {
  res.end(fs.readFileSync(nameFile_books_page_v2, { encoding: 'utf8' }))
})
//Сторінка адмістратора книгами
app.get('/admin/api/v2/', (req: Request, res: Response) => {
  if (req.session.login == admin.login && req.session.pass == admin.parol) {
    res.end(fs.readFileSync(nameFile_admin_v2, { encoding: 'utf8' }))
  } else {
    res.redirect("/api/v2/authorization")
  }
})
//Файл з скриптами для html
app.get('/api/v2/myscript3_2_html.js', (req: Request, res: Response) => {
  res.end(fs.readFileSync(scriptFile_v2, { encoding: 'utf8' }))
})
//Файл з стилями для html
app.get('/api/v2/styles_3_2.css', (req: Request, res: Response) => {
  res.end(fs.readFileSync(stylesFile, { encoding: 'utf8' }))
})
//Файл з стандартним малюкном книги для html
app.get('/api/v2/base.png', jsonParser, (req: Request, res: Response) => {
  res.end(fs.readFileSync(picture))
})
app.get('/api/v2/books/base.png', jsonParser, (req: Request, res: Response) => {
  res.end(fs.readFileSync(picture))
})
//Сторінка з книгою
app.get('/api/v2/books/:id', (req: Request, res: Response) => {
  res.end(fs.readFileSync(nameFile_book_page_v2, { encoding: 'utf8' }))
})
//Запит на отримання однієї книги
app.get('/api/v2/book/:id', jsonParser, (req: Request, res: Response) => {
  getBook2(req.params.id).then(resalt => {
    res.status(200).send(resalt)
  })
})
//Запит на отримання певних книги
app.post('/api/v2/books', jsonParser, (req: Request, res: Response) => {
  getBoks2(req.body).then(resalt => {
    res.status(200).send(resalt)
  })
})
//Запит на отримання всіх книг
app.get('/api/v2/books', jsonParser, (req: Request, res: Response) => {
  getBoks2().then(resalt => {
    res.status(200).send(resalt)
  })
})
//Запит на зміну однієї книги
app.post('/api/v2/book/:id', jsonParser, (req: Request, res: Response) => {
  chengeBook2(req.body.text, req.params.id).then(resalt => {
    res.status(200).send()
    return true
  })
})
//Запит на додавання однієї книги
app.get('/admin/api/v2/addBook', jsonParser, (req: Request, res: Response) => {
  let book = req.query as {
    name: string, author1: string, author2: string, year: string,
    author3: string, peges: string, picture: string, description: string
  }
  addBook2({
    name: book.name, authors: [book.author1, book.author2, book.author3], year: book.year,
    peges: book.peges, picture: book.picture, description: book.description
  }).then(resalt => {
    res.redirect("/admin/api/v2/")
    return true
  })
})
//Запит на видалення однієї книги
app.get('/admin/api/v2/deletBook', jsonParser, (req: Request, res: Response) => {
  deletBook2(req.query as { id: string }).then(resalt => {
    res.redirect("/admin/api/v2/")
    return true
  })
})
//Запит на не видаляння однієї книги
app.get('/admin/api/v2/notDeletBook', jsonParser, (req: Request, res: Response) => {
  notDeletBook2(req.query as { id: string }).then(resalt => {
    res.redirect("/admin/api/v2/")
    return true
  })
})
//Авторизация
let admin = {
  login: "admin",
  parol: "parol"
}
//----V2
app.get('/api/v2/authorization', jsonParser, (req: Request, res: Response) => {
  res.end(fs.readFileSync(nameFile_authorization_v2, { encoding: 'utf8' }))
})
app.get('/api/v2/login', jsonParser, (req: Request, res: Response) => {
  let user = req.query as { login: string, parol: string }
  if (user.login == admin.login && user.parol == admin.parol) {
    req.session.login = user.login;
    req.session.pass = user.parol;
    res.redirect("/admin/api/v2/")
  } else {
    res.redirect("/api/v2/authorization")
  }
})
app.get('/admin/api/v2/logout', jsonParser, (req: Request, res: Response) => {
  req.session.login = undefined;
  req.session.pass = undefined;
  res.redirect("/api/v2/authorization")
})