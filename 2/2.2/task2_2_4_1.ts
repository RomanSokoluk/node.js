import fetch from 'node-fetch';
function start(n=1) {
    fetch("https://random-data-api.com/api/users/random_user")
    .then(function (Promise1) {
        return Promise1.json()
    })
    .then(function (Promise1) {
        let gender = Promise1.gender
        console.log("№: "+n+"; gender: "+gender+"; id : "+Promise1.id);
        if (gender == "Female") { 
            console.log("The woman was found\n");
        } else {
            console.log("This is not a woman\n");
            start(n+1) 
        }
    })
}
start()