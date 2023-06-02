const fs = require("fs");
import express, { Request, Response } from 'express';
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const session = require('express-session')
const FileStore = require('session-file-store')(session);
import { getBoks, getBook, chengeBok, addBook, deletBook, notDeletBook }
  from "./function_BD"
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
const scriptFile = "dist/myscript3_2_html.js";
//----V1
const nameFile_books_page = "html/v1/books-page.html";
const stylesFile = "html/styles_3_2.css";
const nameFile_book_page = "html/v1/book-page.html";
const nameFile_admin = "html/v1/admin.html";
const nameFile_authorization = "html/v1/authorization.html";
//Сторінка з книгами
app.get('/api/v1/', (req: Request, res: Response) => {
  res.end(fs.readFileSync(nameFile_books_page, { encoding: 'utf8' }))
})
//Сторінка адмістратора книгами
app.get('/admin/api/v1/', (req: Request, res: Response) => {
  if (req.session.login == admin.login && req.session.pass == admin.parol) {
    res.end(fs.readFileSync(nameFile_admin, { encoding: 'utf8' }))
  } else {
    res.redirect("/api/v1/authorization")
  }
})
//Файл з скриптами для html
app.get('/api/v1/myscript3_2_html.js', (req: Request, res: Response) => {
  res.end(fs.readFileSync(scriptFile, { encoding: 'utf8' }))
})
//Файл з стилями для html
app.get('/api/v1/styles_3_2.css', (req: Request, res: Response) => {
  res.end(fs.readFileSync(stylesFile, { encoding: 'utf8' }))
})
//Файл з стандартним малюкном книги для html
app.get('/api/v1/base.png', jsonParser, (req: Request, res: Response) => {
  res.end(fs.readFileSync(picture))
})
app.get('/api/v1/books/base.png', jsonParser, (req: Request, res: Response) => {
  res.end(fs.readFileSync(picture))
})
//Сторінка з книгою
app.get('/api/v1/books/:id', (req: Request, res: Response) => {
  res.end(fs.readFileSync(nameFile_book_page, { encoding: 'utf8' }))
})
//Запит на отримання певних книги
app.post('/api/v1/books', jsonParser, (req: Request, res: Response) => {
  getBoks(req.body).then(resalt => {
    res.status(200).send(resalt)
  })
})
//Запит на отримання всіх книг
app.get('/api/v1/books', jsonParser, (req: Request, res: Response) => {
  getBoks().then(resalt => {
    res.status(200).send(resalt)
  })
})
//Запит на отримання однієї книги
app.get('/api/v1/book/:id', jsonParser, (req: Request, res: Response) => {
  getBook(req.params.id).then(resalt => {
    res.status(200).send(resalt)
  })
})
//Запит на зміну однієї книги
app.post('/api/v1/book/:id', jsonParser, (req: Request, res: Response) => {
  chengeBok(req.body.text, req.params.id).then(resalt => {
    res.status(200).send()
    return true
  })
})
//Запит на додавання однієї книги
app.get('/admin/api/v1/addBook', jsonParser, (req: Request, res: Response) => {
  let book = req.query as {
    name: string, author: string, year: string,
    peges: string, picture: string, description: string
  }
  addBook({
    name: book.name, author: book.author, year: book.year,
    peges: book.peges, picture: book.picture, description: book.description
  }).then(resalt => {
    res.redirect("/admin/api/v1/")
    return true
  })
})
//Запит на видалення однієї книги
app.get('/admin/api/v1/deletBook', jsonParser, (req: Request, res: Response) => {
  deletBook(req.query as { id: string }).then(resalt => {
    res.redirect("/admin/api/v1/")
    return true
  })
})
//Запит на не видаляння однієї книги
app.get('/admin/api/v1/notDeletBook', jsonParser, (req: Request, res: Response) => {
  notDeletBook(req.query as { id: string }).then(resalt => {
    res.redirect("/admin/api/v1/")
    return true
  })
})

//Авторизация
let admin = {
  login: "admin",
  parol: "parol"
}
//----V1
app.get('/api/v1/authorization', jsonParser, (req: Request, res: Response) => {
  res.end(fs.readFileSync(nameFile_authorization, { encoding: 'utf8' }))
})
app.get('/api/v1/login', jsonParser, (req: Request, res: Response) => {
  let user = req.query as { login: string, parol: string }
  if (user.login == admin.login && user.parol == admin.parol) {
    req.session.login = user.login;
    req.session.pass = user.parol;
    res.redirect("/admin/api/v1/")
  } else {
    res.redirect("/api/v1/authorization")
  }
})
app.get('/admin/api/v1/logout', jsonParser, (req: Request, res: Response) => {
  req.session.login = undefined;
  req.session.pass = undefined;
  res.redirect("/api/v1/authorization")
})