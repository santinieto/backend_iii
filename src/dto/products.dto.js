import crypto from "crypto";
const { PERSISTENCE } = process.env;

class ProductDTO {
    constructor(data) {
        // Si la persistencia no es Mongo, generamos un _id manual (tipo hex)
        if (PERSISTENCE !== "MONGO") {
            this._id = crypto.randomBytes(12).toString("hex");
        } else {
            this._id = data._id; // si viene de Mongo
        }

        // Adaptamos los campos
        this.name = data.name;
        this.price = data.price;
        this.discount = data.discount ?? 0;
        this.category = data.category;
        this.description = data.description;
        this.thumbnails = data.thumbnails || "picture.png";
        this.stock = data.stock;
        this.code = data.code;
        this.status = data.status ?? true;

        // Agregamos timestamps si están disponibles
        if (PERSISTENCE === "MONGO") {
            this.createdAt = data.createdAt;
            this.updatedAt = data.updatedAt;
        } else {
            this.createdAt = new Date();
            this.updatedAt = new Date();
        }
    }
}

export default ProductDTO;
