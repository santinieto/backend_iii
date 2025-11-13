import crypto from "crypto";
const { PERSISTENCE } = process.env;

class UserDTO {
    constructor(data) {
        // Generar _id si no es Mongo
        if (PERSISTENCE !== "MONGO") {
            this._id = crypto.randomBytes(12).toString("hex");
        } else {
            this._id = data._id;
        }

        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.date = data.date || null;
        this.city = data.city || null;
        this.email = data.email;
        this.password = data.password;
        this.avatar =
            data.avatar ||
            "https://cdn-icons-png.flaticon.com/512/266/266033.png";
        this.role = data.role || "USER";
        this.isVerified = data.isVerified || false;
        this.verificationCode = crypto.randomBytes(12).toString("hex");

        // Timestamps (si existen)
        if (PERSISTENCE === "MONGO") {
            this.createdAt = data.createdAt;
            this.updatedAt = data.updatedAt;
        } else {
            this.createdAt = new Date();
            this.updatedAt = new Date();
        }
    }
}

export default UserDTO;
