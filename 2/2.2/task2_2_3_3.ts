import fetch from 'node-fetch';
function start() {
    let arrayOfPromises:Promise<any>[] = [];
    arrayOfPromises[0]=fetch("https://random-data-api.com/api/name/random_name");
    arrayOfPromises[1]=fetch("https://random-data-api.com/api/name/random_name");
    arrayOfPromises[2]=fetch("https://random-data-api.com/api/name/random_name");
    
    return Promise.all(arrayOfPromises);
}
start().then(function (arrayOfPromises) {
    let arrayOfPromises1:Promise<any>[] = [];
    arrayOfPromises1[0]=arrayOfPromises[0].json();
    arrayOfPromises1[1]=arrayOfPromises[1].json();
    arrayOfPromises1[2]=arrayOfPromises[2].json();
    
    return Promise.all(arrayOfPromises1);
}).then(function (arrayOfPromises) {
    console.log(arrayOfPromises[0].name);
    console.log(arrayOfPromises[1].name);
    console.log(arrayOfPromises[2].name);
})