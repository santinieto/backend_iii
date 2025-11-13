import MongoManager from "./manager.mongo.js";
import Cart from "./models/carts.model.js";
import { productsManager } from "./products.mongo.js";

class CartsManager extends MongoManager {
    constructor() {
        super(Cart);
    }
    createCart = async (cart) => {
        return await this.model.create({ products: cart.products });
    };
    addProductToCart = async (cart_id, product_id, quantity) => {
        const cart = await this.readById(cart_id);
        if (!cart) {
            return {
                status: "error",
                message: `El carrito ${cart_id} no existe`,
            };
        }

        // Verifico que el producto exista
        const product = await productsManager.readById(product_id);
        if (!product) {
            return {
                status: "error",
                message: `El producto ${product_id} no existe`,
            };
        }

        // Si el producto esta en el carrito lo agrego, sino lo creo
        let productsTotal = cart.products || [];

        const existingProduct = productsTotal.find(
            (p) => p.id.toString() === product_id
        );

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            productsTotal.push({
                id: product_id,
                quantity: quantity,
            });
        }

        const updatedCart = await this.updateById(cart_id, {
            products: productsTotal,
        });

        return {
            status: "success",
            message: "Producto agregado correctamente",
            cart: updatedCart,
        };
    };
    updateCart = async (cart_id, products) => {
        const cart = await this.readById(cart_id);
        if (!cart) {
            return {
                status: "error",
                message: `El carrito ${cart_id} no existe`,
            };
        }

        // Si hay productos duplicados los sumo
        let productsTotal = [];

        for (const product of products) {
            const result = await productsManager.readById(product.id);
            if (!result) {
                return {
                    status: "error",
                    message: `El producto ${product.id} no existe`,
                };
            }

            const existingProduct = productsTotal.find(
                (p) => p.id.toString() === product.id
            );

            if (existingProduct) {
                existingProduct.quantity += product.quantity;
            } else {
                productsTotal.push({
                    id: product.id,
                    quantity: product.quantity,
                });
            }
        }

        const updatedCart = await this.updateById(cart_id, {
            products: productsTotal,
        });

        return {
            status: "success",
            message: "Carrito actualizado correctamente",
            cart: updatedCart,
        };
    };

    // readProductsFromUser = async (user_id) =>
    //     await this.readAll({ user_id, state: "reserved" });
    // updateQuantity = async (cart_id, quantity) =>
    //     await this.updateById(cart_id, { quantity });
    // updateState = async (cart_id, state) =>
    //     await this.updateById(cart_id, { state });
    // removeProductFromCart = async (cart_id) => await this.destroyById(cart_id);
}

const cartsManager = new CartsManager();
export { cartsManager };
