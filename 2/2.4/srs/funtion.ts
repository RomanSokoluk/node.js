// Функції для роботи
import {Request, Response} from 'express';

declare module 'express-session' {
  export interface SessionData {
    login: string,
    pass: string
  }
}
import {getTudushkas,addTudushka,chengeTudushka,delTudushka,register,incrisLogin} from "./monga"
let f_get=(req: Request, res: Response) => {
  getTudushkas(req.session.login).then((results) => {
    if (results == 500) {
      return 500
    } else {
      return results.values()
    }
  }).then((results) => {
    if (results == 500) {
      res.status(500).send({ "error": "Невдалося звязатися з базою даних" });
    } else {
      let result = [];
      for (let element of results) {
        result.push(element)
      }
      res.send({ items: result })
    }
  })
}
let f_post=(req: Request, res: Response) => {
  if (typeof req.body.text !== "string") {
    res.status(400).send({ "error": "Некоректний запит" });
  } else {
    addTudushka(req.body, req.session.login).then((dos) => {
      if (dos == "500") {
        res.status(500).send({ "error": "Невдалося звязатися з базою даних" });
      } else {
        res.send({ id: dos })
      }
    })
  }
}
let f_put=(req: Request, res: Response) => {
  if (typeof req.body.text !== "string" || typeof req.body.id !== "number" ||
    typeof req.body.checked !== "boolean") {
    res.status(400).send({ "error": "Некоректний запит" });
  } else {
    chengeTudushka(req.body, req.session.login).then((dos) => {
      if (dos == 500) {
        res.status(500).send({ "error": "Невдалося звязатися з базою даних" });
      } else if (dos == 200) {
        res.send({ "ok": true })
      }
    })
  }
}
let f_delete=(req: Request, res: Response) => {
  if (typeof req.body.id !== "number") {
    res.status(400).send({ "error": "Некоректний запит" });
  } else {
    delTudushka(req.body, req.session.login).then((dos) => {
      if (dos == 500) {
        res.status(500).send({ "error": "Невдалося звязатися з базою даних" });
      } else if (dos == 200) {
        res.send({ "ok": true })
      }
    })
  }
}
let f_register=(req: Request, res: Response) => {
  register(req.body).then((dos) => {
    if (dos == 200) {
      res.send({ "ok": true })
    } else if (dos == 400) {
      res.status(400).send({ "error": "Ведено вже заерестрований логін" });
    } else if (dos == 500) {
      res.status(500).send({ "error": "Невдалося звязатися з базою даних" });
    }
  })
}
let f_login=(req: Request, res: Response) => {
  incrisLogin(req.body).then((dos) => {
    if (dos == 200) {
      req.session.login = req.body.login;
      res.send({ "ok": true })
    } else if (dos == 400) {
      res.status(400).send({ "error": "Ведено некоректний логін або пароль" });
    } else if (dos == 500) {
      res.status(500).send({ "error": "Невдалося звязатися з базою даних" });
    }
  })
}
let f_logout=(req: Request, res: Response) => {
  req.session.login = undefined;
  res.send({ "ok": true })
}
export {f_get,f_post,f_put,f_delete,f_register,f_login,f_logout}