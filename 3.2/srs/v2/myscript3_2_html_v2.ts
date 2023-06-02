type book2 = {
  id: number,
  name: string,
  authors: string[],
  picture: string,
  moved: number,
  wants: number,
  description: string,
  year: number|"----",
  peges: number|"----",
  delet: boolean
}
//Загальне
let datas_v2 = {
  apiURL: 'http://localhost:3005/api/v2/',
  books: new Array<book2>,
  pictureURL: "http://localhost:3005/api/v2/books/base.png",
  offset: 20,
  nove: 0,
  mesegeWahantBook: "Книга свободна и ты можешь прийти за ней." +
    "Наш адрес: г. Кропивницкий, переулок Васильевский 10, 5 этаж." +
    "Лучше предварительно прозвонить и предупредить нас, чтоб" +
    "не попасть в неловкую ситуацию. Тел. 099 196 24 69",
  finde: "Years"
}
function getBooks_v2() {
  let request = conect_v2("GET", `${datas_v2.apiURL}books`)
  if (request[0] == 200) {
    console.log(request[0])
    let regexp = /(?<={).*?(?=})/g;
    let texts = (request[1] + "").match(regexp) || [];
    datas_v2.books = [];
    for (let text of texts) {
      let book: book2 | null = extractBook_v2(text);
      book ? datas_v2.books.push(book) : null
    }
  }
}
function conect_v2(metod: "GET" | "POST", url: string | URL, body?: any): [number, any] {
  let xhttp = new XMLHttpRequest();
  xhttp.open(metod, url, false);
  xhttp.withCredentials = true;
  if (!body) {
    xhttp.send();
  } else {
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(body))
  }
  return [xhttp.status, xhttp.response];
}
function extractBook_v2(text: string): book2 | null {
  let regexp
  let aryMatch: RegExpMatchArray | null;
  if (text.split(",").length >= 10) {
    regexp = /(?<="id":)\d+/;
    let id = Number.parseInt(((text).match(regexp) || ["0"])[0]);

    regexp = /(?<="name":").*?(?=")/;
    let name = ((text).match(regexp) || ["Без назви"])[0];

    regexp = /(?<="authors":\[).*?(?=\])/;
    let author = ((text).match(regexp) || ["Автор невідомий"])[0];
    author.replace("\"","")
    let authors=author.split(",")

    regexp = /(?<="picture":").*?(?=")/;
    let picture = ( (text).match(regexp) || [datas_v2.pictureURL] )[0];

    regexp = /(?<="moved":)\d+/;
    let moved = Number.parseInt(((text).match(regexp) || ["0"])[0]);

    regexp = /(?<="wants":)\d+/;
    let wants = Number.parseInt(((text).match(regexp) || ["0"])[0]);

    regexp = /(?<="description":").*?(?=")/;
    let description = ((text).match(regexp) || ["Опису немає"])[0];

    regexp = /(?<="year":)\d+/;
    aryMatch = (text).match(regexp)
    let year: number | "----" = aryMatch ? Number.parseInt(aryMatch[0]) : "----";

    regexp = /(?<="peges":)\d+/;
    aryMatch = (text).match(regexp)
    let peges: number | "----" = aryMatch ? Number.parseInt(aryMatch[0]) : "----"

    regexp = /(?<="delet":).*?(?=,|$)/;
    aryMatch = (text).match(regexp)
    let delet: boolean = aryMatch ? aryMatch[0]=="true" : false
    return {
      id: id,
      name: name,
      authors: authors,
      picture: picture,
      moved: moved,
      wants: wants,
      description: description,
      year: year,
      peges: peges,
      delet: delet
    }
  } else {
    return null;
  }
}
//books-page.html
function makeBooks_v2() {
  getBooks_v2()
  datas_v2.offset = 20;
  datas_v2.nove = 0;
  load_v2();
}
function load_v2() {
  makeTable_v2();
  (document.getElementById("status_title") as HTMLElement).innerHTML = "Всього книг: " + datas_v2.books.length;
  if (datas_v2.offset + datas_v2.nove < datas_v2.books.length) {
    (document.getElementById("bathonForward") as HTMLElement).style.display = "block"
  } else {
    (document.getElementById("bathonForward") as HTMLElement).style.display = "none"
  }
  if (datas_v2.nove > 0) {
    (document.getElementById("bathonBack") as HTMLElement).style.display = "block"
  } else {
    (document.getElementById("bathonBack") as HTMLElement).style.display = "none"
  }
}
function findeBooks_v2() {
  let whatSearch = (document.getElementById("whatSearch") as HTMLInputElement).value;
  let tageName = "some";
  let elements = document.getElementsByName("finde");
  for (let element of elements) {
    if (element.innerHTML == "Роком" && element.id == "selected") {
      tageName = "year";
    } else if (element.innerHTML == "Автором" && element.id == "selected") {
      tageName = "author";
    } else if (element.innerHTML == "Назвою" && element.id == "selected") {
      tageName = "name";
    }
  }
  let request = conect_v2("POST", `${datas_v2.apiURL}books`, { type: tageName, [tageName]: whatSearch })
  if (request[0] == 200) {
    let regexp = /(?<={).*?(?=})/g;
    let texts = (request[1] + "").match(regexp) || [];
    datas_v2.books = [];
    for (let text of texts) {
      let book: book2 | null = extractBook_v2(text);
      book ? datas_v2.books.push(book) : null
    }
  }
  datas_v2.offset = 20;
  datas_v2.nove = 0;
  load_v2();
}
function findeYears_v2() {
  datas_v2.finde = "Years";
  let elements = document.getElementsByName("finde");
  for (let element of elements) {
    if (element.innerHTML == "Роком") {
      element.id = "selected";
    } else if (element.innerHTML == "Автором") {
      element.id = "";
    } else if (element.innerHTML == "Назвою") {
      element.id = "";
    }
  }
}
function findeAuthors_v2() {
  datas_v2.finde = "Authors";
  let elements = document.getElementsByName("finde");
  for (let element of elements) {
    if (element.innerHTML == "Роком") {
      element.id = "";
    } else if (element.innerHTML == "Автором") {
      element.id = "selected";
    } else if (element.innerHTML == "Назвою") {
      element.id = "";
    }
  }
}
function findeNames_v2() {
  datas_v2.finde = "Names";
  let elements = document.getElementsByName("finde");
  for (let element of elements) {
    if (element.innerHTML == "Роком") {
      element.id = "";
    } else if (element.innerHTML == "Автором") {
      element.id = "";
    } else if (element.innerHTML == "Назвою") {
      element.id = "selected";
    }
  }
}
function resize_v2() {
  let height = document.getElementsByTagName("html")[0].clientHeight / 3 - 4 + "px";
  let width = document.getElementsByTagName("html")[0].clientWidth / 5 - 10 + "px";
  let pictures = document.getElementsByTagName("img")
  for (let picture of pictures) {
    picture.style.height = height;
    picture.style.width = width;
  }
}
function bathonBack_v2() {
  datas_v2.offset -= 10;
  datas_v2.nove -= datas_v2.offset
  load_v2()
}
function bathonForward_v2() {
  datas_v2.nove += datas_v2.offset
  datas_v2.offset += 10;
  load_v2()
}
function makeTable_v2() {
  let booksTable = document.getElementById("booksTable") as HTMLElement;
  booksTable.removeChild(document.getElementById("Table") as HTMLElement);
  let table = document.createElement("table");
  table.id = "Table";
  booksTable.appendChild(table);
  let books: book2[] = datas_v2.books.slice(datas_v2.nove, datas_v2.nove + datas_v2.offset)
  let rovn = document.createElement("tr")
  for (let i = 0; i < books.length; i++) {
    if (i % 5 == 0) {
      rovn = document.createElement("tr")
      table.appendChild(rovn);
    }
    let column = document.createElement("th")
    rovn.appendChild(column);
    let book = document.createElement("a")
    book.href = `books/${books[i].id}?`
    book.id="book"
    column.appendChild(book);
    let picture = document.createElement("img")
    picture.src = books[i].picture;
    picture.alt = datas_v2.pictureURL;
    book.appendChild(picture);
    let lable = document.createElement("p")
    lable.innerHTML = (i + datas_v2.nove + 1) + ":" + books[i].name;
    book.appendChild(lable);
  }
  resize_v2()
}
//book-page.html
function load2_v2() {
  getBooks_v2();
  let regexp = /(?<=\/)\d+?(?=\?)/;
  let bookId = document.documentURI.match(regexp) || ["0"];
  if (getBook_v2(Number.parseInt(bookId[0]))?.moved) {
    conect_v2("POST", `${datas_v2.apiURL}book/${bookId[0]}`, { text: `moved=moved+1` })
  } else {
    conect_v2("POST", `${datas_v2.apiURL}book/${bookId[0]}`, { text: `moved=1` })
  }
  makeBook_v2();
}
function makeBook_v2() {
  let regexp = /(?<=\/)\d+?(?=\?)/;
  let bookId = document.documentURI.match(regexp) || ["0"]
  let book = getBook_v2(Number.parseInt(bookId[0]));
  if (book) {
    let picture = document.getElementById("picture") as HTMLImageElement
    picture.src = book.picture;
    picture.alt = datas_v2.pictureURL;
    (document.getElementById("name") as HTMLElement).innerHTML = book.name;
    (document.getElementById("author") as HTMLElement).innerHTML = book.authors.toString();
    (document.getElementById("looked") as HTMLElement).innerHTML = "Перейшли: " + book.moved + "";
    (document.getElementById("want") as HTMLElement).innerHTML = "Хоче: " + book.wants + "";
    (document.getElementById("year") as HTMLElement).innerHTML = book.year + "";
    (document.getElementById("pedes") as HTMLElement).innerHTML = book.peges + "";
    (document.getElementById("description") as HTMLElement).innerHTML = book.description;
  }
}
function clickButhon_v2() {
  let regexp = /(?<=\/)\d+?(?=\?)/;
  let bookId = document.documentURI.match(regexp) || ["0"];
  if (getBook_v2(Number.parseInt(bookId[0]))?.wants) {
    conect("POST", `${datas_v2.apiURL}book/${bookId[0]}`, { text: `wants=wants+1` })
  } else {
    conect("POST", `${datas_v2.apiURL}book/${bookId[0]}`, { text: `wants=1` })
  }
  makeBook_v2()
  alert(datas_v2.mesegeWahantBook)
}
function getBook_v2(id: number): book2 | null {
  let request = conect_v2("GET", `${datas_v2.apiURL}book/${id}`)
  return extractBook_v2(request[1]) || null
}
//admin.html
function load3_v2() {
  getBooks_v2();
  addBooks_v2();
  if (datas_v2.offset + datas_v2.nove < datas_v2.books.length) {
    (document.getElementById("bathonForward") as HTMLElement).style.display = "block"
  } else {
    (document.getElementById("bathonForward") as HTMLElement).style.display = "none"
  }
  if (datas_v2.nove > 0) {
    (document.getElementById("bathonBack") as HTMLElement).style.display = "block"
  } else {
    (document.getElementById("bathonBack") as HTMLElement).style.display = "none"
  }
}
function bathonBack2_v2() {
  datas_v2.nove -= datas_v2.offset
  load3_v2()
}
function bathonForward2_v2() {
  datas_v2.nove += datas_v2.offset
  load3_v2()
}
function addBooks_v2() {
  let booksList = document.getElementById("carentBooks") as HTMLElement
  let booksTable = document.getElementById("tableBooks") as HTMLElement
  booksList.removeChild(booksTable)
  booksTable = document.createElement("table")
  booksTable.id = "tableBooks";
  booksList.appendChild(booksTable);
  let book = document.createElement("tr")
  booksTable.appendChild(book);
  let element = document.createElement("th")
  element.innerHTML = "Назва"
  book.appendChild(element);
  element = document.createElement("th")
  element.innerHTML = "Рік"
  book.appendChild(element);
  element = document.createElement("th")
  element.innerHTML = "Автор1"
  book.appendChild(element);
  element = document.createElement("th")
  element.innerHTML = "Автор2"
  book.appendChild(element);
  element = document.createElement("th")
  element.innerHTML = "Автор3"
  book.appendChild(element);
  element = document.createElement("th")
  element.innerHTML = "Переходів"
  book.appendChild(element);
  element = document.createElement("th")
  element.innerHTML = "Хоче"
  book.appendChild(element);
  element = document.createElement("th")
  element.innerHTML = "Видалити"
  book.appendChild(element);
  let books: book2[] = datas_v2.books.slice(datas_v2.nove, datas_v2.nove + datas_v2.offset)
  for (let i = 0; i < books.length; i++) {
    book = document.createElement("tr")
    booksTable.appendChild(book);
    element = document.createElement("th")
    book.appendChild(element);
    element.innerHTML = books[i].name
    book.appendChild(element);
    element = document.createElement("th")
    element.innerHTML = books[i].year + ""
    book.appendChild(element);
    element = document.createElement("th")
    element.innerHTML = books[i].authors[0].toString()
    book.appendChild(element);
    element = document.createElement("th")
    if (books[i].authors.length>=2){
    element.innerHTML = books[i].authors[1].toString()
    }else{
      element.innerHTML = "----"
    }
    book.appendChild(element);
    element = document.createElement("th")
    if (books[i].authors.length>=3){
    element.innerHTML = books[i].authors[2].toString()
    }else{
      element.innerHTML = "----"
    }
    book.appendChild(element);
    element = document.createElement("th")
    element.innerHTML = books[i].moved + ""
    book.appendChild(element);
    element = document.createElement("th")
    element.innerHTML = books[i].wants + ""
    book.appendChild(element);
    element = document.createElement("th")
    let delet=document.createElement("form")
    let element2=document.createElement("input")as HTMLInputElement
    element2.value= books[i].id+"";
    element2.style.display= "none";
    element2.name="id"
    delet.appendChild(element2);
    element2=document.createElement("input")
    element2.type="submit";
    element2.value="Удалить";
    if(books[i].delet){
      element2.id="selectedBed"
      delet.action=`notDeletBook`
    }else{
      element2.id="selectedNon"
    delet.action=`deletBook`
    }
    delet.appendChild(element2);
    element.appendChild(delet)
    book.appendChild(element);
  }
  let bathonTable = document.getElementById("moveBathons1") as HTMLElement
  booksList.removeChild(bathonTable)
  booksList.appendChild(bathonTable);
}
function LoadPicture_v2(){
  let picture = document.getElementById("picture") as HTMLImageElement
  picture.src = (document.getElementById("pictureURL")as HTMLInputElement).value;
}
//----------