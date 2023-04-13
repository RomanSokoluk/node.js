import fetch from 'node-fetch';
async function start(n=1) {
    let respond=await fetch("https://random-data-api.com/api/users/random_user")
    let text=await respond.json()
    let gender =await text.gender
    console.log("№: "+n+"; gender: "+gender+"; id : "+text.id);
    if (gender == "Female") { 
        console.log("The woman was found\n");
    } else {
        console.log("This is not a woman\n");
        start(n+1) 
    }
}
start()