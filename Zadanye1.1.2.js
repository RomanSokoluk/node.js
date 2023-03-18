let Validator = {
    validateEmail : function(text){
        let str = /^[a-z\d][a-z\d\-\.\+]{1,19}@[\w\.\!\$\%\&\’\*\+\/\=\?\^\_\-]{1,15}\.[a-z]{1,5}$/i;
        return str.test(text);
    },
    validatePhone : function(text){
        if (text.length>25)return false;
        let str = /(([ -]*\+[ -]*3[ -]*8)-*\s)?[ -]*(\([ -]*0[ -]*9[ -]*9\)|0[ -]*9[ -]*9)-*\s[ -]*(\d[ -]*){7}$/;
        return str.test(text);
    },
    validatePassword : function(text){
        if (text.length<8)return false;
        let str = /(\w*[a-z]\w*[A-Z]\w*[0-9]\w*)|(\w*[a-z]\w*[0-9]\w*[A-Z]\w*)|(\w*[A-Z]\w*[a-z]\w*[0-9]\w*)|(\w*[A-Z]\w*[0-9]\w*[a-z]\w*)|(\w*[0-9]\w*[a-z]\w*[A-Z]\w*)|(\w*[0-9]\w*[A-Z]\w*[a-z]\w*)/;
        return str.test(text);
    }
}
let tests3true=[];
tests3true.push("C00l_Pass");
tests3true.push("SupperPas1");
let tests3false=[];
tests3false.push("Cool_pass");
tests3false.push("C00l");
console.log(Validator.validatePassword(tests3false[1])+" : " + tests3false[1]);
for (test of tests3true){
    if (Validator.validatePassword(test)){
        console.log("tests3true + " + test);
    }else{
        console.log("tests3true - " + test);
    }
}
for (test of tests3false){
    if (!Validator.validatePassword(test)){
        console.log("tests3false + " + test);
    }else{
        console.log("tests3false - " + test);
    }
}