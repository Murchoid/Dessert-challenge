import { Products } from "./products";
import { initUI, initCart, loadCart } from "./style-content";
import data from "./data.json";
import { DatabaseService } from './database';

const db = new DatabaseService();

async function initApp() {
    try {
 
        await db.initDatabase();
        
       
        data.forEach(data => {
            initUI(new Products(data.image.desktop, data.name, data.category, data.price));
        });

        const cartItems = await db.getAllItems();
        initCart(db, cartItems);
        loadCart(db, cartItems);

        setupCartListeners();
    } catch (error) {
        console.error("Error initializing app:", error);
    }
}

function setupCartListeners() {

    document.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;
        

        if (target.closest('.increment')) {
            const button = target.closest('.increment') as HTMLElement;
            const id = button.getAttribute('data-id')!;
            await db.updateQuantity(id, 1);
            refreshCart();
        }
        
        else if (target.closest('.decrement')) {
            const button = target.closest('.decrement') as HTMLElement;
            const id = button.getAttribute('data-id')!;
            await db.updateQuantity(id, -1);
            refreshCart();
        }
    
        else if (target.closest('.remove-cart')) {
            const button = target.closest('.remove-cart') as HTMLElement;
            const id = button.getAttribute('data-id')!;
            await db.deleteItem(id);
            refreshCart();
        }
    });
}

async function refreshCart() {
    const cartItems = await db.getAllItems();
    initCart(db, cartItems);
    

    document.querySelectorAll('.cards').forEach(card => {
        const id = card.id;
        const addButton = card.querySelector('.add-to-cart');
        
        if (addButton && addButton.innerHTML.includes('amount-selected')) {
    
            const currentItem = cartItems.find(item => item.id === id);
            if (currentItem) {
                const amountDisplay = card.querySelector('.amount-selected');
                if (amountDisplay) {
                    amountDisplay.textContent = currentItem.quantity.toString();
                }
            } else {
       
                card.classList.remove('selected');
                addButton.innerHTML = `
                    <img src="assets/images/icon-add-to-cart.svg" alt="" /> Add to Cart
                `;
            }
        }
    });
}

initApp().catch(error => {
    console.error("Application initialization failed:", error);
});