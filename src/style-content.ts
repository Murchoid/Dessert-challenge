import { Products } from './products';
import type {cart} from "./cart.interface";
import { DatabaseService } from './database';



let id = 1;
export async function initUI(product: Products) {

  const mainElement = document.querySelector<HTMLDivElement>('#main')!;
  const div = document.createElement('div');
  div.className = 'cards';
 
  if (mainElement) {
    div.setAttribute("id", `item-${id++}`);
    div.innerHTML = ` 
            
              <div class="images">
                <img src=${product.image} alt="" />
              </div>
              <h3 class="product-title">${product.category}</h3>
              <p class="product-name">${product.name}</p>

              <strong class="price">${product.price} </strong>
              <div class="add-to-cart">
                <img src="assets/images/icon-add-to-cart.svg" alt="" /> Add to Cart
              </div>
            

        `;
    mainElement.append(div);
  }
}


export function initCart(cartItems: cart[]){

  const cartDiv = document.querySelector<HTMLDivElement>('#cart')!;
  let orderTotal = 0;

  if (cartItems.length>0) {

    cartDiv.innerHTML =  `<h2>Your Cart (<strong class="amount-in-cart">${cartItems.length}</strong> )</h2> `
    
    cartItems.forEach((item) => {

      const div = document.createElement('div');
      orderTotal += item.product.price * item.numbers;

      div.innerHTML += `
        <div class="cart-items" id="item-${item.id}">
          <div class="items-in-cart">
            <h3 class="cart-prod-name">${item.product.name}</h3>
            <div class="cart-items-info">
              <p><strong class="no-of-item">1x</strong><em class="price-in-cart">@${
                item.product.price
              }</em> <strong class="total-price">$${item.product.price * item.numbers}</strong></p>
              <img src="./public/assets/images/icon-remove-item.svg" alt="" class="remove-cart">
            </div>
          </div>
          <hr>
      `;

      cartDiv.append(div);

    });

    cartDiv.innerHTML += `<div class="order-info">
            <div class="order-details">
              <h3 class="order-total">Order Total</h3>
              <strong class="total-order-price">$${orderTotal}</strong>
            </div>
            <div class="carbon-free">
              <img src="/assets/images/icon-carbon-neutral.svg" alt="">
              <p>This is a <b>carbon-neutral</b> delivery</p>
            </div>
            <div class="confirm-order">
              Confirm Order
            </div>
            `;
  } else {
    cartDiv.innerHTML = `
        <h2>Your Cart (<strong class="amount-in-cart">0</strong> )</h2>
        <div class="cart-info">
          <img src="./public/assets/images/illustration-empty-cart.svg" alt="" />
        <p class="cart-par">Your added items will appear here</p>
      
        </div>  

    `;
  }
}
  
 export function loadCart(db: DatabaseService, cartItems: cart[]){
     const buttons = document.querySelectorAll<HTMLElement>('.add-to-cart');

  if (buttons) {
    buttons.forEach((button) => {
      button.addEventListener('click', () => {

        const parentDiv = button.closest('.cards');
 
        if (parentDiv) {
          parentDiv.classList = 'cards selected';
          button.innerHTML = `<div id="reduce" ><img src="./public/assets/images/icon-decrement-quantity.svg" alt=""></div>
            <strong class="amount-selected">1</strong>
            <div id="increment" ><img src="./public/assets/images//icon-increment-quantity.svg" alt=""></div>
            `;
          
          const id = parentDiv.id;
          const img = parentDiv.querySelector('.images')!.querySelector('img')!.src as string;
            
          const name = parentDiv.querySelector('.product-name')
            ?.textContent as string;
          const title = parentDiv.querySelector('.product-title')
            ?.textContent as string;
          const price = parseInt(
            parentDiv.querySelector('.price')?.textContent as string
          );

          db.addToCart(id,name, img, title, price);
        }
      });
    });
  }

  initCart(cartItems);
 }

export function deleteItem(db: DatabaseService){

  document.querySelectorAll<HTMLElement>('.remove-cart').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const parentDiv = btn.closest(".remove-cart");
        const id = parentDiv!.id;

      db.deleteItem(id);
      });  
   })
}