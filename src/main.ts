import { Products } from "./products";
import { styleCards,eventListeners, styleCart } from "./style-content";
import data from "./data.json";


console.log(data);

data.forEach(data =>{
    styleCards(new Products(data.image.desktop, data.name, data.category, data.price));
});
eventListeners();
styleCart();
