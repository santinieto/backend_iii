import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Solo si tenés un modelo de usuario, si no, podés omitir o cambiar esto
            required: false,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: { type: String },
                price: { type: Number, required: true, min: 0 },
                quantity: { type: Number, required: true, min: 1 },
                priceAtPurchase: { type: Number, required: true }, // Para guardar el precio en el momento de la compra
                discountAtPurchase: { type: Number, default: 0 }, // Igual para el descuento
            },
        ],
        total: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            enum: ["credit_card", "debit_card", "paypal", "cash_on_delivery"],
            default: "cash_on_delivery",
        },
        shippingAddress: {
            street: String,
            city: String,
            zip: String,
            country: String,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
