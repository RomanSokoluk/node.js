import mysql from "mysql2";
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "books",
  password: "Rz%!om231Df"
}).promise();
const start_table="table_books"
const end_table_books="table_books_2"
const end_table_authors="table_author_2"
const end_table_conection="table_author_book_2"
async function migration(){
  await clean()
  let get = `SELECT id FROM ${start_table};`
  let res: string[] = [];
  await connection.query(get).then(
    (results: any) => {
      for (let elem of results[0]) {
        res.push(
          elem.id
        )
      }
      return res;
    }
  )
  const add_book2 = `INSERT INTO ${end_table_books}(id, name, picture, moved,
wants, description, year, peges, delet)
VALUES ( 
  ?,
  (SELECT name FROM ${start_table} WHERE id=?),
  (SELECT picture FROM ${start_table} WHERE id=?),
  (SELECT moved FROM ${start_table} WHERE id=?),
  (SELECT wants FROM ${start_table} WHERE id=?),
  (SELECT description FROM ${start_table} WHERE id=?),
  (SELECT year FROM ${start_table} WHERE id=?),
  (SELECT peges FROM ${start_table} WHERE id=?),
  (SELECT delet FROM ${start_table} WHERE id=?)
  );`
  const get_author = `SELECT * FROM ${end_table_authors}
WHERE login=(SELECT author FROM ${start_table} WHERE id=?);`
  const add_author = `INSERT INTO ${end_table_authors}(login)
VALUES ( 
  (SELECT author FROM ${start_table} WHERE id=?)
  );`
  const add_author_book = `INSERT INTO ${end_table_conection}(idbook, idauthor)
VALUES (
  ?,
  (SELECT id FROM ${end_table_authors} 
    WHERE login=?
  )
);`
  for (let id of res){
    await connection.query(add_book2,[id,id,id,id,id,id,id,id,id])
    let query=await connection.query(get_author,[id])as [[{author: string}]|[],[]]
    if ((query)[0].length==0){
      await connection.query(add_author,[id])
    }
    let query2=await connection.query(get_author,[id]) as [[{login: string}],[]]
    await connection.query(add_author_book,[id,query2[0][0].login])
  }
  return false;
}
function clean(){
  let clean=`TRUNCATE TABLE ${end_table_books};`
  return connection.query(clean).then(()=>{
    return connection.query(clean,[end_table_authors])
  }).then(()=>{
    return connection.query(clean,[end_table_conection])
  })
}
migration().then(()=>{ connection.end()})