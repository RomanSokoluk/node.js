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
        let head = header + "";
        head = head.replace("_", "-")
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
    let ValidatorHostStudent = /student(?=\.)/;
    let ValidatorHostAnother = /another(?=\.)/;
    let base_folder;
    if (ValidatorHostStudent.test($headers.Host)) {
        base_folder = "1.2\\student";
    } else if (ValidatorHostAnother.test($headers.Host)) {
        base_folder = "1.2\\another";
    } else {
        base_folder = "1.2\\else";
    }
    let text, name = "";
    name = $uri.replace("/", "\\");
    name = base_folder + name;
    try {
        text = require("fs").readFileSync(name);
        outputHttpResponse(200, "OK", headers, text);
    } catch (err) {
        outputHttpResponse(404, "File Not Found", headers, "file not found");
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