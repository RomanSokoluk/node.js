import fetch from 'node-fetch';
async function start2() {
    const response = await fetch("https://random-data-api.com/api/name/random_name");
    const movies = await response.json();
    console.log(movies.name);
}
async function start() {
    start2()
    start2()
    start2()
}
start()