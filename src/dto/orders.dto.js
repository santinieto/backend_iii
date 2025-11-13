import crypto from "crypto";
const { PERSISTENCE } = process.env;

class OrderDTO {
    constructor(data) {
        // Generar _id si no viene de Mongo
        this._id =
            PERSISTENCE !== "MONGO"
                ? crypto.randomBytes(12).toString("hex")
                : data._id;

        // ID del carrito de origen
        this.cart_id = data.cart_id;

        // Lista de productos con normalización de estructura
        this.products = Array.isArray(data.products)
            ? data.products.map((prod) => {
                  const price = prod.price ?? 0;
                  const discount = prod.discount ?? 0;

                  return {
                      id: prod.id,
                      name: prod.name,
                      quantity: prod.quantity,
                      price,
                      discount,
                      priceAtPurchase: price - (price * discount) / 100,
                      discountAtPurchase: discount,
                  };
              })
            : [];

        // Total calculado en la orden
        this.total = data.total ?? 0;

        // Estado de la orden (por defecto: "confirmed")
        this.status = data.status ?? "confirmed";

        // Método de pago
        this.paymentMethod = data.paymentMethod ?? "cash_on_delivery";

        // Dirección de envío
        this.shippingAddress = data.shippingAddress ?? {};

        // Timestamps
        if (PERSISTENCE === "MONGO") {
            this.createdAt = data.createdAt;
            this.updatedAt = data.updatedAt;
        } else {
            this.createdAt = new Date();
            this.updatedAt = new Date();
        }
    }
}

export default OrderDTO;
