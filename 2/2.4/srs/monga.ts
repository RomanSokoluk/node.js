// Механіхма роботи з monga
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017";
const mongoClient = new MongoClient(url);
type Tudushka = { id: number, text: String, checked: Boolean }
let getTudushkas = async (login = "") => {
  let resylt = new Map<number, Tudushka>();
  try {
    await mongoClient.connect()
    const db = mongoClient.db("dataTudushkas");
    let collection = db.collection("Tudushkas" + login);
    let arrayFiles: Array<{
      _id: number, text: String,
      checked: Boolean
    }> = await collection.find().toArray();
    for (let element of arrayFiles) {
      let tudushka = {
        id: Number(element._id),
        text: String(element.text),
        checked: element.checked
      }
      resylt.set(tudushka.id, tudushka)
    }
  } catch (err) {
    return 500
  } finally {
    // Закрываем подключение при завершении работы или при ошибке
    await mongoClient.close();
    return await resylt;
  }
}
let addTudushka = async (resylt: { text: String }, login = "") => {
  try {
    await mongoClient.connect()
    let db = mongoClient.db("dataTudushkas");
    let collection = db.collection("TudushkasNamb" + login);
    let id;
    try {
      let namb = await collection.find().toArray()
      id = namb[0].Namb;
      id++;
      collection.deleteMany()
      collection.insertOne({ Namb: id })
    } catch (err) {
      id = 1;
      collection.insertOne({ Namb: id })
    }
    collection = db.collection("Tudushkas" + login);
    await collection.insertOne({
      _id: id,
      text: resylt.text,
      checked: false
    });
    return id
  } catch (err) {
    return "500"
  }
  finally {
    // Закрываем подключение при завершении работы или при ошибке
    await mongoClient.close();
  }
}
let chengeTudushka = async (resylt: Tudushka, login = "") => {
  try {
    await mongoClient.connect()
    let db = mongoClient.db("dataTudushkas");
    let collection = db.collection("Tudushkas" + login);
    await collection.updateOne()({ _id: resylt.id }, {
      $set: {
        text: resylt.text,
        checked: resylt.checked
      }
    });
    return 200
  } catch (err) {
    return 500
  }
  finally {
    // Закрываем подключение при завершении работы или при ошибке
    await mongoClient.close();
  }
}
let delTudushka = async (resylt: Tudushka, login = "") => {
  try {
    await mongoClient.connect()
    let db = mongoClient.db("dataTudushkas");
    let collection = db.collection("Tudushkas" + login);
    await collection.deleteOne({ _id: resylt.id });
    return 200
  } catch (err) {
    return 500
  }
  finally {
    // Закрываем подключение при завершении работы или при ошибке
    await mongoClient.close();
  }
}
let register = async (resylt: { login: String, pass: String }) => {
  try {
    await mongoClient.connect()
    let db = mongoClient.db("dataTudushkas");
    let collection = db.collection("Logins");
    const results = await collection.find({ login: resylt.login }).toArray();
    if (results.length != 0) {
      return 400
    } else {
      await collection.insertOne({
        login: resylt.login,
        pass: resylt.pass
      });
      return 200
    }
  } catch (err) {
    return 500
  }
  finally {
    // Закрываем подключение при завершении работы или при ошибке
    await mongoClient.close();
  }
}
let incrisLogin = async (resylt: { login: String, pass: String }) => {
  try {
    await mongoClient.connect()
    let db = mongoClient.db("dataTudushkas");
    let collection = db.collection("Logins");
    let results = await collection.find({
      login: resylt.login,
      pass: resylt.pass
    }).toArray();
    if (results.length != 0) { return 200 }
    else { return 400 }
  } catch (err) {
    return 500
  }
  finally {
    // Закрываем подключение при завершении работы или при ошибке
    await mongoClient.close();
  }
}
export {
  getTudushkas, addTudushka, chengeTudushka, delTudushka,
  register, incrisLogin
}