import mysql from "mysql2";
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "books",
  password: "Rz%!om231Df"
}).promise();
//Версія 1
type book = {
  id: number,
  name: string,
  author: string,
  picture: string,
  moved: number,
  wants: number,
  description: string,
  year: number,
  peges: number,
  delet: boolean
}
function getBoks(were?: { type: "year", year: string } | { type: "author", author: string } |
{ type: "name", name: string }) {
  let get;
  if (!were) {
    get = `SELECT * FROM table_books;`
    return connection.query(get).then(
      (results: any) => {
        let res: book[] = [];
        for (let elem of results[0]) {
          res.push({
            id: elem.id,
            author: elem.author,
            picture: elem.picture,
            moved: elem.moved,
            name: elem.name,
            peges: elem.peges,
            description: elem.description,
            year: elem.year,
            wants: elem.wants,
            delet: elem.delet == "1"
          })
        }
        return res;
      }
    )
  } else {
    let value = "%"
    if (were.type == "year") {
      value += were.year
    } else if (were.type == "author") {
      value += were.author
    } else {
      value += were.name
    }
    value += "%"
    get = `SELECT * FROM table_books
WHERE ${were.type} LIKE ?;`;
    return connection.query(get, [value]).then(
      (results: any) => {
        let res: book[] = [];
        for (let elem of results[0]) {
          res.push({
            id: elem.id,
            author: elem.author,
            picture: elem.picture,
            moved: elem.moved,
            name: elem.name,
            peges: elem.peges,
            description: elem.description,
            year: elem.year,
            wants: elem.wants,
            delet: elem.delet == "1"
          })
        }
        return res;
      }
    )
  }
}
function chengeBok(set: string, id: string) {
  let enter = ["", ""];
  enter[1] = set.replace(/[;]/, "")
  let update = `UPDATE table_books
SET ${enter[1]}
WHERE  id=?;`
  return connection.query(update, [id])
}
function getBook(id: string) {
  const get1 = `SELECT * FROM table_books
WHERE id=?;`
  return connection.query(get1, [id]).then(
    (results: any) => {
      let book = {
        id: results[0][0].id,
        author: results[0][0].author,
        picture: results[0][0].picture,
        moved: results[0][0].moved,
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
}
function addBook(book: {
  name: string, author: string, year: string,
  peges: string, picture: string, description: string
}) {
  const get1 = `INSERT INTO table_books(name, author, year, peges, picture, description)
VALUES (?, ?, ?, ?, ?, ?);`
  return connection.query(get1, [book.name, book.author, book.year, book.peges, book.picture, book.description])
}
function deletBook(book: { id: string }) {
  const get1 = `UPDATE table_books
SET delet=true
WHERE id=?;`
  return connection.query(get1, [book.id])
}
function notDeletBook(book: { id: string }) {
  const get1 = `UPDATE table_books
SET delet=false
WHERE id=?;`
  return connection.query(get1, [book.id])
}
export { getBoks, getBook, chengeBok, addBook, deletBook, notDeletBook }