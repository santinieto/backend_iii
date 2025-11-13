import FileSystemManager from "./manager.fs.js";
import { productsManager } from "./products.fs.js";

const cartsFilePath = "./data/carts.json";

class CartsManager extends FileSystemManager {
    constructor() {
        super(cartsFilePath).ensureFileExists();
    }

    createCart = async (cart) => {
        await this.createOne(cart);
        return cart;
    };

    addProductToCart = async (cart_id, product_id, quantity) => {
        const cart = await this.readById(cart_id);
        if (!cart) {
            return {
                status: "error",
                message: `El carrito ${cart_id} no existe`,
            };
        }

        const product = await productsManager.readById(product_id);
        if (!product) {
            return {
                status: "error",
                message: `El producto ${product_id} no existe`,
            };
        }

        let productsTotal = cart.products || [];
        const existingProduct = productsTotal.find((p) => p._id === product_id);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            productsTotal.push({ id: product_id, quantity });
        }

        const updatedCart = await this.updateById(cart_id, {
            products: productsTotal,
        });
        console.log(updatedCart);

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
                (p) => p.id === product.id
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
}

const cartsManager = new CartsManager();
export { cartsManager };
