import crypto from "crypto";
const { PERSISTENCE } = process.env;

class PetDTO {
    constructor(data) {
        // Generar _id si no es Mongo
        if (PERSISTENCE !== "MONGO") {
            this._id = crypto.randomBytes(12).toString("hex");
        } else {
            this._id = data._id;
        }

        // Datos principales
        this.name = data.name;
        this.species = data.species || "desconocida"; // perro, gato, etc.
        this.breed = data.breed || null;
        this.age = data.age || null;

        // Relación con usuario
        this.owner = data.owner || null; // ID del usuario dueño

        // Otros datos
        this.city = data.city || null;
        this.avatar =
            data.avatar ||
            "https://cdn-icons-png.flaticon.com/512/1998/1998611.png"; // un lindo icono de mascota
        this.isAdopted = data.isAdopted ?? true;

        // Código para validaciones o trazabilidad interna
        this.internalCode = crypto.randomBytes(8).toString("hex");

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

export default PetDTO;
