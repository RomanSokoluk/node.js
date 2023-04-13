function readHttpLikeInput() {
    var fs = require("fs");
    var res = "";
    var buffer = Buffer.alloc ? Buffer.alloc(1) : new Buffer(1);
    let was10 = 0;
    for (; ;) {
        try { fs.readSync(0 /*stdin fd*/, buffer, 0, 1); } catch (e) { break; /* windows */ }
        if (buffer[0] === 10 || buffer[0] === 13) {
            if (was10 > 10)
                break;
            was10++;
        } else
            was10 = 0;
        res += new String(buffer);
    }

    return res;
}

let contents = readHttpLikeInput();

function outputHttpResponse(statusCode, statusMessage, headers, body) {
    if (headers.Content_Length == -1) {
        headers.Content_Length = body.length;
    }
    console.log("HTTP/1.1 " + statusCode + " " + statusMessage);
    for (header in headers) {
        let head=header+"";
        head=head.replace("_","-")
        console.log(head + ": " + headers[header]);
    }
    console.log("\n" + body);
}

function processHttpRequest($method, $uri, $headers, $body) {
    let headers = {
        Server: "Apache/2.2.14 (Win32)",
        Content_Length: -1,
        Connection: "Closed",
        Content_Type: "text/html; charset=utf-8"
    };
    let Validator404 = /^\/\S+/;
    let ValidatorLogin = /(?<=^login=)\w+(?=&)/;
    let ValidatorPassword = /(?<=&password=)\d+$/;
    if (!Validator404.test($uri)) {
        outputHttpResponse(404, "Not Found", headers, "not found");
    }
    else if ($method != "POST") {
        outputHttpResponse(400, "Bad Request", headers, "bad request");
    } else {
        while (true) {
            let login = $uri.match(ValidatorLogin);
            let password = $uri.match(ValidatorPassword);
            let text;
            try {
                text = String.toString(require("fs").readFileSync("1.2\\passwords.txt"));
                text = text.split("\n");
            } catch (err){
                outputHttpResponse(500, "Internal Server Error", headers, "internal server error");
                break;
            }
            let login_password = new Map();
            for (log_passw in text) {
                let login1, password1;
                [login1, password1] = log_passw.split(":");
                login_password.set(login1, password1)
            }
            if (login_password.get(login) == password) {
                outputHttpResponse(200, "OK", headers, '<h1 style="color:green">FOUND</h1>');
            } else {
                outputHttpResponse(220, "Incorrect Data", headers, "incorrect login or password");
            } break;
        }
    }
}

function parseTcpStringAsHttpRequest(string) {
    let strings = string.split("\n");
    let strings1 = [];
    for (string1 of strings) {
        if (string1 != "") {
            strings1.push(string1);
        }
    }
    strings = strings1;
    let ValidatorMethod = /^\S*(?=\s)/;
    let ValidatorUri = /(?<=\s)\S*(?=\s)/;
    let result = {
        method: strings[0].match(ValidatorMethod)[0],
        uri: strings[0].match(ValidatorUri)[0],
        headers: {},
        body: strings[strings.length - 1]
    };
    let bodyadded;
    let UnValidatorBody = /^.*:.*$/;
    if (UnValidatorBody.test(result.body)) {
        result.body = "";
        bodyadded = 0;
    } else {
        bodyadded = 1;
    }
    let ValidatorHeader = /^\S*(?=:)/;
    let ValidatorValue = /(?<=:\s*).*$/;
    for (let i = 1; i < strings.length - bodyadded; i++) {
        let header, value;
        header = strings[i].match(ValidatorHeader)[0];
        value = strings[i].match(ValidatorValue)[0];
        result.headers[header] = value;
    }
    return result;
}

http = parseTcpStringAsHttpRequest(contents);
processHttpRequest(http.method, http.uri, http.headers, http.body);