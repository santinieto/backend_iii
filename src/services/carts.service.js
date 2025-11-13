import cartRepository from "../repositories/carts.repository.js";
import { productService } from "./products.service.js";
import { Service } from "./base.service.js";

class CartService extends Service {
    constructor() {
        super(cartRepository);
    }

    async addProductToCart(cartId, productId, quantity) {
        return await this.repository.addProductToCart(
            cartId,
            productId,
            quantity
        );
    }

    async getDetailedCart(cartId) {
        const cartData = await this.repository.readOne(cartId);
        if (!cartData) return null;

        return await this.#buildDetailedCart(cartData);
    }

    async getAllDetailedCarts() {
        const allCarts = await this.repository.readAll();
        if (!allCarts) return [];

        const detailedCarts = await Promise.all(
            allCarts.map((cart) => this.#buildDetailedCart(cart))
        );

        return detailedCarts;
    }

    // Método privado para construir el detalle del carrito
    async #buildDetailedCart(cartData) {
        const detailedProducts = await Promise.all(
            cartData.products.map(async (prod) => {
                const product = await productService.readOne(prod.id);
                const price = product?.price || 0;
                const discount = product?.discount || 0;
                const priceAtPurchase = price - (price * discount) / 100;
                return {
                    id: prod.id,
                    name: product?.name || "Producto desconocido",
                    price,
                    quantity: prod.quantity,
                    discount,
                    priceAtPurchase,
                    subtotal: priceAtPurchase * prod.quantity,
                };
            })
        );

        const total = detailedProducts.reduce((sum, p) => sum + p.subtotal, 0);

        return {
            _id: cartData._id,
            products: detailedProducts,
            total,
            createdAt: cartData.createdAt,
            updatedAt: cartData.updatedAt,
        };
    }
}

export const cartService = new CartService();
