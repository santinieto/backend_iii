import FileSystemManager from "./manager.fs.js";
import { cartsManager } from "./carts.fs.js";
import { productsManager } from "./products.fs.js";

const ordersFilePath = "./data/orders.json";

class OrdersManager extends FileSystemManager {
    constructor() {
        super(ordersFilePath).ensureFileExists();
    }

    createOrder = async ({
        cart_id,
        paymentMethod = "cash_on_delivery",
        shippingAddress = {},
    }) => {
        const cart = await cartsManager.readById(cart_id);
        if (!cart) {
            return {
                status: "error",
                message: `El carrito ${cart_id} no existe`,
            };
        }

        const products = [];
        let total = 0;

        for (const item of cart.products) {
            const product = await productsManager.readById(item.id);
            if (!product) {
                return {
                    status: "error",
                    message: `El producto ${item.id} no existe`,
                };
            }

            const price = product.price;
            const discount = product.discount || 0;
            const quantity = item.quantity;

            const priceAfterDiscount = price - (price * discount) / 100;
            const subtotal = priceAfterDiscount * quantity;
            total += subtotal;

            products.push({
                id: item.id,
                name: item.name,
                quantity,
                price: item.price,
                priceAtPurchase: priceAfterDiscount,
                discountAtPurchase: discount,
            });
        }

        const newOrder = {
            cart_id,
            products,
            total,
            status: "confirmed",
            paymentMethod,
            shippingAddress,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const savedOrder = await this.createOne(newOrder);
        return {
            status: "success",
            message: "Orden creada correctamente",
            order: savedOrder,
        };
    };
}

const ordersManager = new OrdersManager();
export { ordersManager };
