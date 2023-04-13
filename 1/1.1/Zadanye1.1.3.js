'use strict'
class AbstractProduct{
    ID= 0;
    name= "Название";
    description= "Краткое описание";
    price= 10.0;
    brand= "Бренд";
    quantity= 0;
    date= new Date();
    reviews= [];
    images=[];  
    Getter_Setter(property,value=NaN){
        if (value!=NaN){
            switch(property) {
            case "ID": this.ID=value;
            case "name": this.name=value;
            case "description": this.description=value;
            case "price": this.price=value;
            case "brand": this.brand=value;
            case "quantity": this.quantity=value;
            case "date": this.date=value;
            case "reviews": this.reviews=value;
            case "images": this.images=value;
            }
        }
        switch(property) {
            case "ID": return this.ID;
            case "name": return this.name;
            case "description": return this.description;
            case "price": return this.price;
            case "brand": return this.brand;
            case "quantity": return this.quantity;
            case "date": return this.date;
            case "reviews": return this.reviews;
            case "images": return this.images;
        }
    }
    getFullInformation(){
        let result = "";
        result+="ID - "+this.ID+"\n";
        result+="name - "+this.name+"\n";
        result+="brand - "+this.brand+"\n";
        result+="price - "+this.price+"\n";
        result+="description - "+this.description+"\n";
        result+="quantity - "+this.quantity+"\n";
        result+="date - "+this.date+"\n";
        result+="reviews - "+this.reviews+"\n";
        result+="images - "+this.images;
        return result;
    }
    getPriceForQuantity(int){
        return this.price*int;
    }
}
let Clothes={
    __proto__:new AbstractProduct(),
    material:"material",
    getMaterial(){
        return this.material;
    },
    setMaterial(Material){
        this.material=Material;
    },
    color:"color",
    getColor(){
        return this.color;
    },
    setColor(Color){
        this.color=Color;
    }
};
let Electronics={
    __proto__:new AbstractProduct(),
    warranty:15,
    getWarranty(){
        return this.warranty;
    },
    setWarranty(Warranty){
        this.warranty=Warranty;
    },
    power:7,
    getPower(){
        return this.power;
    },
    setPower(Power){
        this.power=Power;
    }
};