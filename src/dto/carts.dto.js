import crypto from "crypto";
import { productService } from "../services/products.service.js";

const { PERSISTENCE } = process.env;

class CartDTO {
    constructor(data) {
        this._id =
            PERSISTENCE !== "MONGO"
                ? crypto.randomBytes(12).toString("hex")
                : data._id;

        this.products = Array.isArray(data.products)
            ? data.products
                  .filter((prod) => prod && prod.id && prod.quantity)
                  .map((prod) => ({
                      id: prod.id,
                      quantity: prod.quantity,
                      _id: prod._id,
                  }))
            : [];

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

export default CartDTO;
