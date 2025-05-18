import { Products } from "./products";
import { initUI,initCart, loadCart } from "./style-content";
import data from "./data.json";
import { DatabaseService } from './database';

const db = new DatabaseService();


async function initApp(){
    await db.initDatabase();
    data.forEach(data =>{
    initUI(new Products(data.image.desktop, data.name, data.category, data.price));
    });

    const cartItems = await db.getAllItems();
    initCart(cartItems);
    loadCart(db, cartItems);
}


  const dec = document.querySelector<HTMLElement>("#reduce");
  dec?.addEventListener("click", ()=>{
    let id = document.querySelector("#id")!.id;
    let amount = document.querySelector<HTMLElement>(".amount-selected")!;
    let currentAmount: unknown = parseInt(amount.textContent as string);
    (currentAmount as number)--;
    amount.textContent = (currentAmount as number).toString();

    db.increaseCart(id, currentAmount as number);
  })


  const inc = document.querySelector<HTMLElement>("#increment");
  inc?.addEventListener("click", ()=>{
    let id = document.querySelector("#id")!.id;
    let amount = document.querySelector<HTMLElement>(".amount-selected")!;
    let currentAmount: unknown = parseInt(amount.textContent as string);
    (currentAmount as number)++;
    amount.textContent = (currentAmount as number).toString();

    db.increaseCart(id, currentAmount as number);
  })


 
initApp();