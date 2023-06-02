import mysql from "mysql2";
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "books",
  password: "Rz%!om231Df"
}).promise();
//Версія 2
type book2 = {
  id: number,
  name: string,
  authors: string[],
  picture: string,
  moved: number,
  wants: number,
  description: string,
  year: number,
  peges: number,
  delet: boolean
}
function chengeBook2(set: string, id: string) {
  let enter = ["", ""];
  enter[1] = set.replace(/[;]/, "")
  let update = `UPDATE table_books_2
SET ${enter[1]}
WHERE id=?;`
  return connection.query(update, [id])
}
async function getBook2(id: string) {
  const get1 = `SELECT * FROM table_books_2
WHERE id=?;`
  let book: book2 = await connection.query(get1, [id]).then(
    (results: any) => {
      let book = {
        id: results[0][0].id,
        picture: results[0][0].picture,
        moved: results[0][0].moved,
        authors: [],
        name: results[0][0].name,
        peges: results[0][0].peges,
        description: results[0][0].description,
        year: results[0][0].year,
        wants: results[0][0].wants,
        delet: results[0][0].delet == "1"
      }
      return book;
    }
  )
  const get_authorId = `SELECT * FROM table_author_book_2
WHERE idbook=?;`
  let authorsId: string[] = []
  await connection.query(get_authorId, [book.id]).then(
    (results: any) => {
      for (let elem of results[0]) {
        authorsId.push(
          elem.idauthor
        )
      }
      return true;
    }
  )
  const get_author = `SELECT * FROM table_author_2
WHERE id=?;`
  for (let id of authorsId) {
    await connection.query(get_author, [id]).then(
      (results: any) => {
        for (let elem of results[0]) {
          book.authors.push(
            elem.login
          )
        }
        return true;
      }
    )
  }
  return book;
}
async function addBook2(book: {
  name: string, authors: string[], year: string,
  peges: string, picture: string, description: string
}) {
  const get1 = `INSERT INTO table_books_2(name, year, peges, picture, description)
VALUES (?, ?, ?, ?, ?);`
  await connection.query(get1, [book.name, book.year, book.peges, book.picture, book.description])
  const get_author = `SELECT * FROM table_author_2
WHERE login=?;`
  const add_author = `INSERT INTO table_author_2(login)
VALUES ( ? );`
  for (let author of book.authors) {
    let query = await connection.query(get_author, [author]) as [[{ author: string }] | [], []]
    if ((query)[0].length == 0) {
      await connection.query(add_author, [author])
    }
    const add_author_book = `INSERT INTO table_author_book_2(idbook, idauthor)
  VALUES (
    (SELECT id FROM table_books_2
      WHERE name=?
    ),
    (SELECT id FROM table_author_2 
      WHERE login=?
    )
  );`
    await connection.query(add_author_book, [book.name, author])
  }
  return true
}
async function getBoks3(were?: { type: "year"|"author"|"name", data: string }) {
  let get;
  let boks: book2[] = []
  if (!were) {
    let get = `SELECT id FROM table_books_2;`
    let id_s: string[] = [];
    await connection.query(get).then(
      (results: any) => {
        for (let elem of results[0]) {
          id_s.push(
            elem.id
          )
        }
        return true;
      }
    )
    for (let id of id_s) {
      boks.push(await getBook2(id))
    }
  } else if (were.type == "year" || were.type == "name") {
    let value = "%"+were.data+"%"
    get = `SELECT * FROM table_books_2
WHERE ${were.type} LIKE ?;`;
    let id_s: string[] = [];
    await connection.query(get, [value]).then(
      (results: any) => {
        for (let elem of results[0]) {
          id_s.push(
            elem.id
          )
        }
        return true;
      }
    )
    for (let id of id_s) {
      boks.push(await getBook2(id))
    }
  } else if(were.type =="author"){
    let value = "%"+were.data+"%";
    let get = `SELECT * FROM table_author_book_2
WHERE idauthor IN (SELECT id FROM table_author_2 WHERE login LIKE ?);`
    let id_s: string[] = [];
    await connection.query(get,[value]).then(
      (results: any) => {
        for (let elem of results[0]) {
          id_s.push(
            elem.idbook
          )
        }
        return true;
      }
    )
    for (let id of id_s) {
      boks.push(await getBook2(id))
    }
  }
  return boks
}
export { getBook2, chengeBook2, addBook2,getBoks3 }