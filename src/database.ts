import { Products } from './products';
import type { cart } from "./cart.interface";

export class DatabaseService {
    private db: IDBDatabase | null = null;
    private readonly DB_NAME = 'cartDb';
    private readonly STORE_NAME = 'cart';

    constructor() {
        this.initDatabase();
    }

    public initDatabase(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, 1);

            request.onerror = () => reject(request.error);

            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    const store = db.createObjectStore(this.STORE_NAME, {
                        keyPath: 'id'
                    });
                    store.createIndex('product_name', 'product.name', { unique: false });
                }
            };
        });
    }

    async addToCart(id: string, name: string, image: string, category: string, price: number): Promise<string> {
        return new Promise((resolve, reject) => {
            
            this.getItemByProductId(id).then(existingItem => {
                const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
                const store = transaction.objectStore(this.STORE_NAME);

                if (existingItem) {
                    
                    existingItem.quantity += 1;
                    const request = store.put(existingItem);
                    request.onsuccess = () => resolve(existingItem.id);
                    request.onerror = () => reject(request.error);
                } else {
                    
                    const item: cart = {
                        id: id,
                        product: new Products(image, name, category, price),
                        quantity: 1
                    };
                    const request = store.add(item);
                    request.onsuccess = () => resolve(id);
                    request.onerror = () => reject(request.error);
                }
            });
        });
    }

    async updateQuantity(id: string, change: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.get(id);

            request.onsuccess = () => {
                const item = request.result;
                if (item) {
                    item.quantity += change;
                    
                    if (item.quantity <= 0) {
                        
                        store.delete(id).onsuccess = () => resolve();
                    } else {
                        
                        store.put(item).onsuccess = () => resolve();
                    }
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getItemByProductId(productId: string): Promise<cart | null> {
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.get(productId);

            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteItem(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getAllItems(): Promise<cart[]> {
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    async clearCart(): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}