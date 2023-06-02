let data = {
  pictureURL: "/imege/base.png"
}
//books-page.html
function plagitator_books_page(pege: string, books: book2[], n_pege: number,
  url:string) {
  pege = pege.replace(/{N_Books}/, books.length + "")
  pege = replase_table(pege,books,n_pege);
  pege = replase_buthons(pege,books,n_pege,url);
  return pege
}
function replase_table(text:string,books:book2[],n_pege:number){
  let use_boks = get_use_boks(books, n_pege)
  let text_replese = "{tr0}\n"
  for (let i = 1; i < (use_boks.length - 1) / 5 + 1; i++) {
    text_replese += `{tr${i}}\n`
  }
  text = text.replace(/{Table}/, "<table>\n" + text_replese + "\n</table>")
  text = text.replace(/{tr(\d+)}/g, (match, p1, offset, string) => {
    text_replese = "";
    let str = p1 * 5, end = ((p1 + 1) * 5 < use_boks.length) ? (p1 + 1) * 5 : use_boks.length;
    for (let i = str; i < end; i++) {
      text_replese += `{book${i}}\n`
    }
    return "<tr>\n" + text_replese + "\n</tr>";
  })
  text = text.replace(/{book(\d+)}/g, (match, p1, offset, string) => {
    let new_pege_book = `/api/v3/book/${use_boks[p1].id}`
    text_replese = `<a href="${new_pege_book}">\n`;
    let picture = use_boks[p1].picture ? use_boks[p1].picture : data.pictureURL
    text_replese += `<img src=${picture} alt="Обкладинка книги">\n`
    text_replese += `<p>${use_boks[p1].name}</p>\n`
    text_replese += "</a>\n"
    return "<th>\n" + text_replese + "\n</th>";
  })
  return text
}
function replase_buthons(text:string,books:book2[],n_pege:number,url:string,
  increment=10){
  text=text.replace(/{bathonBack}/, (match, offset, string) => {
    let next_pege_books = url;
    next_pege_books=next_pege_books.replace(/\/(\d+)/,(match, p1, offset, string) => {
      return "\/"+(Number.parseInt(p1)-1)
    })
    let text_replese=`<a href="${next_pege_books}">\n`
    text_replese+=`<button id="bathonBack"`
    if (n_pege > 1) {
      text_replese+= `style="display: block;"`
    } else {
      text_replese+= `style="display: none;"`
    }
    text_replese+=`>Назад</button>`
    text_replese += "</a>\n"
    return text_replese
  })
  text = text.replace(/{bathonForward}/, (match, offset, string) => {
    let next_pege_books = url;
    next_pege_books=next_pege_books.replace(/\/(\d+)/,(match, p1, offset, string) => {
      return "\/"+(Number.parseInt(p1)+1)
    })
    let text_replese=`<a href="${next_pege_books}">\n`
    text_replese+=`<button id="bathonBack"`
    let start_show_books = 0;
    let namber_show_books = 20;
    for (let i = 1; i < n_pege; i++) {
      start_show_books += namber_show_books
      namber_show_books += increment;
    }
    if (start_show_books + namber_show_books<books.length) {
      text_replese+= `style="display: block;"`
    } else {
      text_replese+= `style="display: none;"`
    }
    text_replese+=`>Вперед</button>`
    text_replese += "</a>\n"
    return text_replese
  })
  return text
}
function get_use_boks(books: book2[], n_pege: number,increment=10) {
  let start_show_books = 0;
  let namber_show_books = 20;
  for (let i = 1; i < n_pege; i++) {
    start_show_books += namber_show_books
    namber_show_books += increment;
  }
  return books.slice(start_show_books, start_show_books + namber_show_books)
}
//book-page.html
function plagitator_book_page(pege: string, book: book2) {
  pege = pege.replace(/{picture}/, `<img alt="picture" src = ${book.picture}>`)
  pege = pege.replace(/{name}/, `${book.name}`)
  pege = pege.replace(/{looked}/, `${book.moved}`)
  pege = pege.replace(/{want}/, `${book.wants}`)
  pege = pege.replace(/{author}/, `${book.authors}`)
  pege = pege.replace(/{year}/, `${book.year}`)
  pege = pege.replace(/{pedes}/, `${book.peges}`)
  pege = pege.replace(/{description}/, `${book.description}`)
  return pege
}
//admin.html
function plagitator_admin_page(pege: string, books: book2[], n_pege: number,
  url:string) {
    pege = pege.replace(/{N_Books}/, books.length + "")
    pege = replase_table_admin(pege,books,n_pege);
    pege = replase_buthons(pege,books,n_pege,url,0);
  return pege
}
function replase_table_admin(text:string,books:book2[],n_pege:number){
  let use_boks = get_use_boks(books, n_pege,0)
  let text_replese = "{trs}\n"
  for (let i = 0; i < use_boks.length; i++) {
    text_replese += `{tr${i}}\n`
  }
  text = text.replace(/{Table}/, "<table>\n" + text_replese + "\n</table>")
  text = text.replace(/{trs}/g, (match, offset, string) => {
    text_replese = "";
    text_replese+=`<th>Назва</th>`
    text_replese+=`<th>Рік</th>`
    text_replese+=`<th>Автор 1</th>`
    text_replese+=`<th>Автор 2</th>`
    text_replese+=`<th>Автор 3</th>`
    text_replese+=`<th>Перейшли</th>`
    text_replese+=`<th><p id="retreat">Хоче</p></th>`
    text_replese+=`<th>Не\\Видалити</th>`
    return "<tr>\n" + text_replese + "\n</tr>";
  })
  text = text.replace(/{tr(\d+)}/g, (match, p1, offset, string) => {
    text_replese = "";
    text_replese+=`<th>${use_boks[p1].name}</th>`
    text_replese+=`<th>${use_boks[p1].year}</th>`
    text_replese+=`<th>${use_boks[p1].authors[0]}</th>`
    if(use_boks[p1].authors.length>1){
    text_replese+=`<th>${use_boks[p1].authors[1]}</th>`
    }else{
      text_replese+=`<th>----</th>`
    }
    if(use_boks[p1].authors.length>2){
    text_replese+=`<th>${use_boks[p1].authors[2]}</th>`
    }else{
      text_replese+=`<th>----</th>`
    }
    text_replese+=`<th>${use_boks[p1].moved}</th>`
    text_replese+=`<th>${use_boks[p1].wants}</th>`
    if (use_boks[p1].delet){
      text_replese+=`<th><a href="/api/admin/v3/book/${use_boks[p1].id}?chenge=false&page=${n_pege}">
      <button>Не видаляти</button></a></th>`
    }else{
      text_replese+=`<th><a href="/api/admin/v3/book/${use_boks[p1].id}?chenge=true&page=${n_pege}">
      <button>Видалити</button></a></th>`
    }
    return "<tr>\n" + text_replese + "\n</tr>";
  })
  return text
}
export { plagitator_books_page,plagitator_book_page,plagitator_admin_page }