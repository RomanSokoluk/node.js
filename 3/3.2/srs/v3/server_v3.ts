const fs = require("fs");
import express, { Request, Response } from 'express';
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const session = require('express-session')
const FileStore = require('session-file-store')(session);
import { getBook2, chengeBook2, addBook2, getBoks3 }
  from "./function_BD_v2"
import { plagitator_books_page,plagitator_book_page,plagitator_admin_page }
  from "./plagitator"
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
//----V3
const nameFile_books_page_v3 = "html/v3/books-page_v3.html";
const scriptFile_v3 = "dist/v3/myscript3_2_html_v3.js";
const nameFile_book_page_v3 = "html/v3/book-page_v3.html";
const nameFile_admin_v3 = "html/v3/admin_v3.html";
const nameFile_authorization_v3 = "html/v3/authorization_v3.html";

//Файл з скриптами для html
app.get('/api/v3/myscript3_2_html.js', (req: Request, res: Response) => {
  res.end(fs.readFileSync(scriptFile_v3, { encoding: 'utf8' }))
})
//Файл з стилями для html
app.get('/api/v3/styles_3_2.css', (req: Request, res: Response) => {
  res.end(fs.readFileSync(stylesFile, { encoding: 'utf8' }))
})
//Сторінка з книгами
app.get('/api/v3/books/:n', (req: Request, res: Response) => {
  let p_Book = Number.parseInt(req.params.n)
  if (!p_Book||p_Book<1)p_Book=1
  getBoks3().then(resalt => {
    return plagitator_books_page(
      fs.readFileSync(nameFile_books_page_v3, { encoding: 'utf8' }),
      resalt,
      p_Book,
      `/api/v3/books/${p_Book}`)
  }).then(resalt => {
    res.end(resalt)
  })
})
app.get('/api/v3/books', (req: Request, res: Response) => {
  res.redirect(`/api/v3/books/1`)
})
//Сторінка з книгами з пошуком по певному критерію
app.get('/api/v3/findebooks/:n', (req: Request, res: Response) => {
  let were = req.query as {
    type: "year"|"author"|"name", data: string
  }
  let p_Book = Number.parseInt(req.params.n)
  if (!p_Book||p_Book<1)p_Book=1
  getBoks3(were).then(resalt => {
    return plagitator_books_page(
      fs.readFileSync(nameFile_books_page_v3, { encoding: 'utf8' }),
      resalt,
      p_Book,
      `/api/v3/findebooks/${p_Book}?type=${were.type}&data=${were.data}`)
  }).then(resalt => {
    res.end(resalt)
  })
})
//Файл з стандартним малюкном книги для html
app.get('/imege/base.png', jsonParser, (req: Request, res: Response) => {
  res.end(fs.readFileSync(picture))
})
//Сторінка з книгою
app.get('/api/v3/book/:id', (req: Request, res: Response) => {
  getBook2(req.params.id).then(resalt => {
    return plagitator_book_page(
      fs.readFileSync(nameFile_book_page_v3, { encoding: 'utf8' }),
      resalt)
  }).then(resalt => {
    res.end(resalt)
  })
})
//Запит на зміну однієї книги
app.post('/api/v3/book/:id', jsonParser, (req: Request, res: Response) => {
  chengeBook2(req.body.text, req.params.id).then(resalt => {
    res.status(200).send()
    return true
  })
})
//Запит на видалення/(не видаляння) однієї книги
app.get('/api/admin/v3/book/:id', jsonParser, (req: Request, res: Response) => {
  let dats=req.query as { chenge: string,page:string }
  if (!dats.page)dats.page="1"
  let id=req.params as { id: string }
  chengeBook2("delet="+dats.chenge,id.id).then(resalt => {
    res.redirect(`/admin/api/v3/books/${dats.page}`)
    return true
  })
})
app.get('/api/admin/v3/book/', (req: Request, res: Response) => {
  res.redirect(`/api/admin/v3/book/1`)
})
//Запит на додавання однієї книги
app.get('/admin/api/v3/addBook', jsonParser, (req: Request, res: Response) => {
  let book = req.query as {
    name: string, author1: string, author2: string, year: string,
    author3: string, peges: string, picture: string, description: string
  }
  addBook2({
    name: book.name, authors: [book.author1, book.author2, book.author3], year: book.year,
    peges: book.peges, picture: book.picture, description: book.description
  }).then(resalt => {
    res.redirect("/admin/api/v3/books/1")
    return true
  })
})
//Сторінка адмістратора книгами
app.get('/admin/api/v3/books/:n', (req: Request, res: Response) => {
  let p_Book = Number.parseInt(req.params.n)
  if (!p_Book||p_Book<1)p_Book=1
  getBoks3().then(resalt => {
    return plagitator_admin_page(
      fs.readFileSync(nameFile_admin_v3, { encoding: 'utf8' }),
      resalt,
      p_Book,
      `/admin/api/v3/books/${p_Book}`)
  }).then(resalt => {
    res.end(resalt)
  })
})
//Авторизация
let admin = {
  login: "admin",
  parol: "parol"
}
//----V3
app.get('/api/v3/authorization', jsonParser, (req: Request, res: Response) => {
  res.end(fs.readFileSync(nameFile_authorization_v3, { encoding: 'utf8' }))
})
app.get('/api/v3/login', jsonParser, (req: Request, res: Response) => {
  let user = req.query as { login: string, parol: string }
  if (user.login == admin.login && user.parol == admin.parol) {
    req.session.login = user.login;
    req.session.pass = user.parol;
    res.redirect("/admin/api/v3/books/1")
  } else {
    res.redirect("/api/v3/authorization")
  }
})
app.get('/admin/api/v3/logout', jsonParser, (req: Request, res: Response) => {
  req.session.login = undefined;
  req.session.pass = undefined;
  res.redirect("/api/v3/authorization")
})