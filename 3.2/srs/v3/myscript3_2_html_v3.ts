//Загальне
let datas_v3 = {
  apiURL: 'http://localhost:3005/api/v3/',
  books: new Array<book2>,
  pictureURL: "/imege/base.png",
  offset: 20,
  nove: 0,
  mesegeWahantBook: "Книга свободна и ты можешь прийти за ней." +
    "Наш адрес: г. Кропивницкий, переулок Васильевский 10, 5 этаж." +
    "Лучше предварительно прозвонить и предупредить нас, чтоб" +
    "не попасть в неловкую ситуацию. Тел. 099 196 24 69",
  finde: "Years"
}
function conect_v3(metod: "GET" | "POST", url: string | URL, body?: any): [number, any] {
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
//books-page.html
function resize_v3() {
  let height = document.getElementsByTagName("html")[0].clientHeight / 3 - 4 + "px";
  let width = document.getElementsByTagName("html")[0].clientWidth / 5 - 10 + "px";
  let pictures = document.getElementsByTagName("img")
  for (let picture of pictures) {
    picture.style.height = height;
    picture.style.width = width;
  }
}
//book-page.html
function load2_v3() {
  let regexp = /(?<=\/)\d+$/;
  let bookId = document.documentURI.match(regexp) || ["0"];
  if (getBook_v2(Number.parseInt(bookId[0]))?.moved) {
    conect_v2("POST", `${datas_v2.apiURL}book/${bookId[0]}`, { text: `moved=moved+1` })
  } else {
    conect_v2("POST", `${datas_v2.apiURL}book/${bookId[0]}`, { text: `moved=1` })
  }
}
function clickButhon_v3() {
  let regexp = /(?<=\/)\d+$/;
  let bookId = document.documentURI.match(regexp) || ["0"];
  if (getBook_v2(Number.parseInt(bookId[0]))?.wants) {
    conect("POST", `${datas_v2.apiURL}book/${bookId[0]}`, { text: `wants=wants+1` })
  } else {
    conect("POST", `${datas_v2.apiURL}book/${bookId[0]}`, { text: `wants=1` })
  }
  alert(datas_v2.mesegeWahantBook)
}
//admin.html
function LoadPicture_v3(){
  let picture = document.getElementById("picture") as HTMLImageElement
  picture.src = (document.getElementById("pictureURL")as HTMLInputElement).value;
}
//----------