import { Products } from './products';

export function styleCards(product: Products) {
  const mainElement = document.querySelector<HTMLDivElement>('#main')!;
  const div = document.createElement('div');
  div.className = "cards";
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

export function styleCart(itemsInCart: Products) {
  const cartDiv = document.querySelector<HTMLDivElement>('#cart')!;
  const div = document.createElement('div');
  if (itemsInCart) {
    div.innerHTML +=
        `
        <div class="cart-items">
          <div class="items-in-cart">
            <h3 class="cart-prod-name">${itemsInCart.name}</h3>
            <div class="cart-items-info">
              <p><strong class="no-of-item">1x</strong><em class="price-in-cart">@${itemsInCart.price}</em> <strong class="total-price">$5.50</strong></p>
              <img src="./public/assets/images/icon-remove-item.svg" alt="">
            </div>
          </div>
          <hr>
      `
    ;

    cartDiv.append(div);
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
