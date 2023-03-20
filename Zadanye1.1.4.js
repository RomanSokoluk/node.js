function function1(text){
    let texts1=text.split("\n");
    function filt(element){
        let element1=element.split("#")[0].split(",");
        if (element1.length==5){
            return {x:element1[0],y:element1[1],name:element1[2],
                population:element1[3]}
        }else{
            return false;
        }
    }
    let texts2=texts1.map(filt);
    let texts3=texts2.filter(element=>element);
    function compareNumbers(b, a) {
        return a.population - b.population;
      }
    texts3.sort(compareNumbers);
    let texts4=texts3.slice(0,10);
    texts4.unshift({})
    let texts5={}
    texts4.reduce((accumulator, currentValue, currentIndex)=>
    texts5[currentValue.name]={population:currentValue.population,
        rating:(currentIndex)});
    return (text)=>{
        for (key of Object.keys(texts5)){
            text=text.replace(key,(key+" ("+texts5[key].rating+
            " место в ТОП-10 самых крупных городов Украины, население "
            +texts5[key].population+" человек)"));
        }
        return text;
    }
}