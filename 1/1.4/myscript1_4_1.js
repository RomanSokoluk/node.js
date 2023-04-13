
function displayNone() {
    let elements = document.getElementsByTagName("div");
    for (element of elements) {
        if (element.id == "black_square" && element.style.display != "none") {
            element.style.display = "none";
        } else if (element.id == "black_square") {
            element.style.display = "block";
        }
    }
}
function JSDelet() {
    try {
        document.getElementById("task1-3").removeChild(document.getElementById("table_black_square"));
    }
    catch {
        let table = document.createElement("table");
        table.id = "table_black_square";
        for (i = 0; i <= 5; i++) {
            let column = document.createElement("th")
            let blackSquare = document.createElement("div")
            blackSquare.id = "black_square";
            column.appendChild(blackSquare);
            table.appendChild(column);
        }
        document.getElementById("task1-3").appendChild(table);
    }
}
function CSS_JS_Hide() {
    let elements = document.getElementsByTagName("div");
    for (element of elements) {
        if (element.id == "black_square" && element.className != "hidden") {
            element.className = "hidden";
        } else if(element.id == "black_square"){
            element.className = null;
        }
    }
}
function CSS_Selector() {
    let inputValue = document.getElementById("inputElement").value;
    let elements;
    while (true) {
        if (inputValue[0] == ".") {
            elements = document.getElementsByClassName(inputValue.slice(1));
        } else if (inputValue[0] != "#") {
            elements = document.getElementsByTagName(inputValue);
        } else {
            break;
        }
        for (element of elements) {
            if (element.className != "hidden") {
                element.className = "hidden";
            } else {
                element.className = null;
            }
        } break;
    }
    if (inputValue[0] == "#") {
        elements = document.getElementById(inputValue.slice(1));
        if (elements.className != "hidden") {
            elements.className = "hidden";
        } else {
            elements.className = null;
        }
    }
}
function helloFromTheYellowSquare() {
    document.getElementById("yellow_square").setAttribute("onclick",
        "cleaningTheYellowSquare()");
    alert("Привет");
}
function cleaningTheYellowSquare() {
    document.getElementById("yellow_square").style.display = "none";
}
function showTheRedSquare() {
    document.getElementById("red_square").style.display = "block";
}
function cleaningTheRedSquare() {
    document.getElementById("red_square").style.display = "none";
}
function showTheGreenSquare() {
    document.getElementById("green_rectangle").style.display = "block";
}
function cleaningTheGreenSquare() {
    document.getElementById("green_rectangle").style.display = "none";
}
function Picture_Selector() {
    let paragraphPictures = document.getElementById("task8-9");
    let tablePictures;
    tablePictures = paragraphPictures.children;
    paragraphPictures.removeChild(tablePictures[2]);
    tablePictures = document.createElement("table");
    paragraphPictures.appendChild(tablePictures);
    let inputUrls = document.getElementById("inputUrl").value.split("\n");
    for (Url of inputUrls) {
        let imgUrl = document.createElement("img");
        imgUrl.src = Url;
        imgUrl.alt = "Image";
        let columnWithPicture = document.createElement("th");
        columnWithPicture.appendChild(imgUrl);
        tablePictures.appendChild(columnWithPicture);
    }
}
function showMouseCoordinates(event) {
    event = event || window.event;
    document.getElementById("cursorCoordinates").innerHTML = 
    event.offsetX + " : " + event.offsetY;
}
function seveInputs() {
    localStorage.setItem('element13_1', document.getElementById("element13_1").value);
    sessionStorage.setItem('element13_3', document.getElementById("element13_3").value);
    let seve = 'element13_2=' + document.getElementById('element13_2').value;
    document.cookie = seve;
}
function openInputs() {
    document.getElementById("element13_1").value = localStorage.getItem('element13_1');
    document.getElementById("element13_2").value = document.cookie;
    document.getElementById("element13_3").value = sessionStorage.getItem('element13_3');
}
function scrollButtonTop() {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}
function element15Alert() {
    if (sessionStorage.getItem('element15_1') == "false") {
        alert('task15')
    }
    sessionStorage.setItem('element15_1', false);
}
function element15_1Alert() {
    alert('element15_1')
    sessionStorage.setItem('element15_1', true);
}
function showTheGraySquare() {
    document.getElementById("element16_2").style.display = 'block'
    document.body.style.overflow = 'hidden'
}
function hideTheGraySquare() {
    document.getElementById("element16_2").style.display = 'none'
    document.body.style.overflow = "auto"
}
function showFile() {
    let picture = document.getElementById("element18_2")
    if (document.getElementById("element18_1").value == "") {
        picture.style.display = "none"
        picture.style.left = 0;
        picture.style.top = 0;
    } else {
        picture.style.display = "block"
        let num = Number(window.getComputedStyle(picture).width.replace("px", "")) / 2
        picture.style.left = num + "px"
        num = Number(window.getComputedStyle(picture).height.replace("px", "")) / 2
        picture.style.top = num + "px"
    }
}
function DragNDrop(element) {
    element.onmousedown = function (e) {

        let coords = getCoords(element);
        let shiftX = e.pageX - coords.left;
        let shiftY = e.pageY - coords.top;

        moveAt(e);

        element.style.zIndex = 10;

        function moveAt(e) {
            element.style.left = e.pageX - shiftX + 'px';
            element.style.top = e.pageY - shiftY + 'px';
        }

        document.onmousemove = function (e) {
            moveAt(e);
        };

        element.onmouseup = function () {
            document.onmousemove = null;
            element.onmouseup = null;
        };

    }

    element.ondragstart = function () {
        return false;
    };

    function getCoords(elem) {
        let box = elem.getBoundingClientRect();
        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }
}