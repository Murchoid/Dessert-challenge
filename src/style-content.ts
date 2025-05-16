import { Products } from "./products";

export function styleCards(product: Products){
    const mainElement = document.getElementById("main");
    if (mainElement) {
        mainElement.innerHTML +=
        ` 
            <div class="cards">
              <div class="images">
                <img src=${product.image} alt="" />
              </div>
              <h3 class="product-title">${product.category}</h3>
              <p class="product-name">${product.name}</p>

              <strong class="price">${product.price} </strong>
              <div class="add-to-cart">
                <img src="assets/images/icon-add-to-cart.svg" alt="" /> Add to Cart
              </div>
            </div>

        `;
    }
}

export function styleCart(cartAmount: number, itemsInCart: Products){
    const asside = document.getElementById("cart");
    if(asside){
        asside.innerHTML = 
        ` <h2>Your Cart (<strong class="amount-in-cart">${(cartAmount ? cartAmount : 0)}</strong> )</h2>
        <div class="cart-info">
          <img src=${cartAmount ? itemsInCart.image} alt="" />
        <p class="cart-par">Your added items will appear here</p>
      
        </div> 
        ` ;
    }
}