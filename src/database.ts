// database.service.ts
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
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    store.createIndex('name', 'name', { unique: false });
                }
            };
        });
    }

    // CRUD Operations for cart items
    async addToCart(_id: string, _name: string, _image:string, _category: string, _price: number): Promise<void> {
        const item = {product: new Products(_image,_name,_category, _price), numbers: 1};
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.add(item);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async increaseCart(id: string, quantity: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.get(id);

            request.onsuccess = () => {
                const data = request.result;
                if (data) {
                    data.number = quantity;
                    store.put(data);
                    resolve();
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    async decrease(id: string, quantity: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.get(id);

            request.onsuccess = () => {
                const data = request.result;
                if (data) {
                    data.rating = quantity;
                    store.put(data);
                    resolve();
                }
            };
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

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}