import fetch from 'node-fetch';
async function start() {
    const response = await fetch("https://api.ipify.org?format=json");
    const movies = await response.json();
    console.log(movies.ip);
}
start() 