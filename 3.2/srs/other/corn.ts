import mysqldump from 'mysqldump';
import mysql from "mysql2";
let date = new Date()
let namFile = "dump_"+date.getDate()+"_"+(date.getMonth()+1)
const connection= mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "books",
  password: "Rz%!om231Df"
}).promise();
mysqldump({
  connection: {
    host: "localhost",
    user: "root",
    database: "books",
    password: "Rz%!om231Df"
  },
  dumpToFile: 'F:/Sokoluk_Roman/SH++/Etap2/3/3.2/dump/' + namFile + '.sql',
});
function deletBookEnd() {
  const del1 = `DELETE FROM table_books
WHERE delet=1;`;
  const del2 = `DELETE FROM table_books_2
WHERE delet=1;`;
  const del3 = `DELETE FROM table_author_book_2
WHERE idbook NOT IN (SELECT id FROM table_books_2);`;
  const del4 = `DELETE FROM table_author_2
  WHERE id NOT IN (SELECT idauthor FROM table_author_book_2);`;
  return connection.query(del1).then(()=>
    {return connection.query(del2)}
  ).then(()=>
  {return connection.query(del3)}
  ).then(()=>
  {return connection.query(del4)}
  );
}
deletBookEnd().then(()=>{ connection.end()})
