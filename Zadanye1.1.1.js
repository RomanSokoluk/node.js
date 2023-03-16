function Product(){
    this.ID= 0;
    this.getID=function(){
        return this.ID;
    }
    this.setID=function(ID){
        this.ID=ID;
    }

    this.name= "Название";
    this.getName=function(){
        return this.name;
    }
    this.setName=function(Name){
        this.name=Name;
    }

    this.description= "Краткое описание";
    this.getDescription=function(){
        return this.description;
    }
    this.setDescription=function(Description){
        this.description=Description;
    }

    this.price= 0.0;
    this.getPrice=function(){
        return this.price;
    }
    this.setPrice=function(Price){
        this.price=Price;
    }

    this.brand= "Бренд";
    this.getBrand=function(){
        return this.brand;
    }
    this.setBrand=function(Brand){
        this.brand=Brand;
    }

    this.sizes= ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    this.getSizes=function(){
        return this.sizes;
    }
    this.setSizes=function(Sizes){
        this.sizes=Sizes;
    }
    this.addSize=function(Size){
        this.sizes.push(Size);
    }
    this.deleteSize=function(key){
        let newSize=[];
        for (i=0;i<this.sizes.length;i++){
            if (this.sizes[i]!=key){
                newSize.push(this.sizes[i]);
            }
        }
        this.sizes=newSize;
    }

    this.activeSize= "Активный размер";
    this.getActiveSize=function(){
        return this.activeSize;
    }
    this.setActiveSize=function(ActiveSize){
        this.activeSize=ActiveSize;
    }

    this.quantity= 0;
    this.getGuantity=function(){
        return this.quantity;
    }
    this.setGuantity=function(Guantity){
        this.quantity=Guantity;
    }

    this.date= new Date();
    this.getDate=function(){
        return this.date;
    }
    this.setDate=function(Date){
        this.date=Date;
    }

    this.reviews= [new review(), new review()];
    this.getReviews=function(){
        return this.reviews;
    }
    this.setReviews=function(Reviews){
        this.reviews=Reviews;
    }
    this.getReviewByID=function(IDReview){
        for(getReview in reviews){
            if (getReview.ID==IDReview){
                return getReview;
            }
        }
    }
    this.addReview=function(Review){
        this.reviews.push(Review);
    }
    this.deleteReview=function(IDReview){
        let newReview=[];
        for (i=0;i<this.reviews.length;i++){
            if (this.reviews[i].ID!=IDReview){
                newReview.push(this.reviews[i]);
            }
        }
        this.reviews=newReview;
    }
    this.getAverageRating=function(){
        let result=0.0;
        for (i=0;i<this.reviews.length;i++){
            let rating=0;
            ratings=this.reviews[i].rating.values();
            for (mark of ratings){
                rating+=mark;
            }
            rating/=4.;
            result+=rating;
        }
        result/=this.reviews.length;
        return result;
    }

    this.images=['Изображениe1','Изображениe2'];
    this.getImages=function(){
        return this.images;
    }
    this.getImage=function(param=0){
        return this.images[param];
    }
    this.setImages=function(Images){
        this.images=Images;
    }
    
}
var review = function(){
    this.ID= "Ключ продукта (уникальное значение)";
    this.author= "Название";
    this.date= new Date();
    this.comment= "comment";
    this.rating= new Map([
        ['service', 1],
        ['price',2],
        ['value',2],
        ['quality',1]]
        );
}

function Search(products,search){
    let resalt=[];
    for (product of products){
        let text =product.getName();
        checkingPresenceSearchedText(text,search)
        if (iSearch==search.length){
            continue;
        }
        text =product.getDescription();
        checkingPresenceSearchedText(text,search)
    }
    return resalt;
}
function checkingPresenceSearchedText(text,search){
    let iSearch=0;
    for (letter in text){
        if (search[iSearch]==text[letter]){
            iSearch++
            if (iSearch==search.length){
                return true;
            }
        }else{
            iSearch=0; 
            if (search[iSearch]==text[letter]){
                iSearch++
                if (iSearch==search.length){
                    return true;
                }
            }
        }
    }
    return false;
}
function Sort(products,sortRule){
    let productsWithSortingElement=new Map();
    for (product of products){
        if (sortRule=="Price"){
            productsWithSortingElement.set(product.getPrice(),product);
        }else if (sortRule=="ID"){
            productsWithSortingElement.set(product.getID(),product);
        }else if (sortRule=="Name"){
            productsWithSortingElement.set(product.getName(),product);
        }
    }
    let SortingKeysMassif=[];
    let ElementsKeys=productsWithSortingElement.keys();
    for (SortingElement of ElementsKeys){
        SortingKeysMassif.push(SortingElement);
    }
    if (sortRule="Name"){
        SortingKeysMassif.sort() 
    }else {
        SortingKeysMassif.sort(compareNumeric);
    }
    let result=[];
    for(MassifElement of productsWithSortingElement.keys()){
        result[SortingKeysMassif.indexOf(MassifElement)]=
        productsWithSortingElement.get(MassifElement);
    }
    return result;
}
function compare(a, b) {
    if (a > b) return 1;
    if (a == b) return 0;
    if (a < b) return -1;
}