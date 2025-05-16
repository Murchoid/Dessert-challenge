export class Products{
    image: string;
    name: string;
    category: string;
    price: number;

    constructor(_image: string, _name: string, _category:string, _price: number){
        this.image = _image;
        this.name = _name;
        this.category = _category;
        this.price = _price;
    }
}