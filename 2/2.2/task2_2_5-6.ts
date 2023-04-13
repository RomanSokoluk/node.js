import fetch from 'node-fetch';
async function one() {
    const response = await fetch("https://api.ipify.org?format=json");
    const movies = await response.json();
    return movies.ip;
}
async function two() {
    return await one()
}
function start(funct:(result:any)=>any) {
    two().then(funct)
}
start((result:any)=>console.log(result))