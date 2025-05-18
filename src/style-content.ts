import { Products } from './products';
import type { cart } from "./cart.interface";
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
      <strong class="price">${product.price}</strong>
      <div class="add-to-cart">
        <img src="assets/images/icon-add-to-cart.svg" alt="" /> Add to Cart
      </div>
    `;
    mainElement.append(div);
  }
}

export function initCart(db: DatabaseService, cartItems: cart[]) {
  const cartDiv = document.querySelector<HTMLDivElement>('#cart')!;
  let orderTotal = 0;

  if (cartItems.length > 0) {
    cartDiv.innerHTML = `<h2>Your Cart (<strong class="amount-in-cart">${cartItems.length}</strong>)</h2>`;
    
    cartItems.forEach((item) => {
      const div = document.createElement('div');
      orderTotal += item.product.price * item.quantity;

      div.innerHTML = `
        <div class="cart-items" id="cart-item-${item.id}">
          <div class="items-in-cart">
            <h3 class="cart-prod-name">${item.product.name}</h3>
            <div class="cart-items-info">
              <p>
                <div class="quantity-btn decrement" data-id="${item.id}">
                  <img src="./assets/images/icon-decrement-quantity.svg" alt="">
                </div>
                <strong class="no-of-item">${item.quantity}x</strong>
                <em class="price-in-cart">@${item.product.price}</em> 
                <strong class="total-price">$${item.product.price * item.quantity}</strong>
                <div class="quantity-btn increment" data-id="${item.id}">
                  <img src="./assets/images/icon-increment-quantity.svg" alt="">
                </div>
              </p>
              <img src="./assets/images/icon-remove-item.svg" alt="" class="remove-cart" data-id="${item.id}">
            </div>
          </div>
          <hr>
        </div>
      `;

      cartDiv.append(div);
    });

    cartDiv.innerHTML += `
      <div class="order-info">
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
      </div>
    `;
  } else {
    cartDiv.innerHTML = `
      <h2>Your Cart (<strong class="amount-in-cart">0</strong>)</h2>
      <div class="cart-info">
        <img src="./assets/images/illustration-empty-cart.svg" alt="" />
        <p class="cart-par">Your added items will appear here</p>
      </div>
    `;
  }

  setupCartEventListeners(db);
}

function setupCartEventListeners(db: DatabaseService) {

  document.querySelectorAll<HTMLElement>('.remove-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.getAttribute('data-id')!;
      db.deleteItem(itemId);
    });
  });


  document.querySelectorAll<HTMLElement>('.increment').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.getAttribute('data-id')!;
      db.updateQuantity(itemId, 1);
    });
  });


  document.querySelectorAll<HTMLElement>('.decrement').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.getAttribute('data-id')!;
      db.updateQuantity(itemId, -1);
    });
  });
}

export function loadCart(db: DatabaseService, cartItems: cart[]) {
  const buttons = document.querySelectorAll<HTMLElement>('.add-to-cart');

  buttons.forEach((button) => {
    
    button.replaceWith(button.cloneNode(true));
  });

  document.querySelectorAll<HTMLElement>('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const parentDiv = button.closest('.cards');
      
      if (parentDiv) {
        const id = parentDiv.id;
        const img = parentDiv.querySelector('.images img')!.getAttribute('src')!;
        const name = parentDiv.querySelector('.product-name')?.textContent || '';
        const title = parentDiv.querySelector('.product-title')?.textContent || '';
        const price = parseInt(parentDiv.querySelector('.price')?.textContent || '0');

        parentDiv.classList.add('selected');
        button.innerHTML = `
          <div class="quantity-btn decrement" data-id="${id}">
            <img src="./assets/images/icon-decrement-quantity.svg" alt="">
          </div>
          <strong class="amount-selected">1</strong>
          <div class="quantity-btn increment" data-id="${id}">
            <img src="./assets/images/icon-increment-quantity.svg" alt="">
          </div>
        `;

        db.addToCart(id, name, img, title, price);
        
      
        parentDiv.querySelector('.decrement')?.addEventListener('click', () => {
          db.updateQuantity(id, -1);
        });
        
        parentDiv.querySelector('.increment')?.addEventListener('click', () => {
          db.updateQuantity(id, 1);
        });
      }
    });
  });

  initCart(db, cartItems);
}