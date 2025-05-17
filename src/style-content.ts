import { Products } from './products';
import { DatabaseService } from './database';

const db = new DatabaseService();
await db.initDatabase();

export function styleCards(product: Products) {
  const mainElement = document.querySelector<HTMLDivElement>('#main')!;
  const div = document.createElement('div');
  div.className = 'cards';
  if (mainElement) {
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

export async function styleCart() {
  const cartDiv = document.querySelector<HTMLDivElement>('#cart')!;
  const itemsInCart = await db.getAllItems();
  if (itemsInCart) {
    cartDiv.innerHTML =  `<h2>Your Cart (<strong class="amount-in-cart">${itemsInCart.length}</strong> )</h2> `
    itemsInCart.forEach((item) => {
      const div = document.createElement('div');

      div.innerHTML += `
        <div class="cart-items">
          <div class="items-in-cart">
            <h3 class="cart-prod-name">${item.product.name}</h3>
            <div class="cart-items-info">
              <p><strong class="no-of-item">1x</strong><em class="price-in-cart">@${
                item.product.price
              }</em> <strong class="total-price">$${
        item.product.price * item.numbers
      }</strong></p>
              <img src="./public/assets/images/icon-remove-item.svg" alt="">
            </div>
          </div>
          <hr>
      `;

      cartDiv.append(div);
    });
    cartDiv.innerHTML += `<div class="order-info">
            <div class="order-details">
              <h3 class="order-total">Order Total</h3>
              <strong class="total-order-price">$40.9</strong>
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

export function eventListeners() {
  const buttons = document.querySelectorAll<HTMLElement>('.add-to-cart');

  if (buttons) {
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        let count = 1;
        const parentDiv = button.closest('.cards');
        if (parentDiv) {
          parentDiv.classList = 'cards selected';
          button.innerHTML = `<div id="reduce" onclick= "decreaseInCart()"><img src="./public/assets/images/icon-decrement-quantity.svg" alt=""></div>
            <strong class="amount-selected">${count}</strong>
            <div id="increment" onclick= "${() =>count++}"><img src="./public/assets/images//icon-increment-quantity.svg" alt=""></div>
            `;
          const img = parentDiv.closest('.images')?.closest('img')
            ?.src as string;
          const name = parentDiv.closest('.product-name')
            ?.textContent as string;
          const title = parentDiv.closest('.product-title')
            ?.textContent as string;
          const price = parseInt(
            parentDiv.closest('.price')?.textContent as string
          );

          db.addToCart(name, img, title, price);
          styleCart();
        }
      });
    });
  }
}
