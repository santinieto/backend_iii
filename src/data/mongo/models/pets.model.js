import mongoose from "mongoose";

const PetSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        species: { type: String, default: "desconocida" },
        breed: { type: String, default: null },
        age: {
            type: Number,
            min: 0,
            default: null,
        },
        // Relación con usuario (dueño)
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        city: { type: String, default: null },
        avatar: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/1998/1998611.png",
        },
        isAdopted: { type: Boolean, default: true },
        // Campo interno generado por DTO
        internalCode: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // crea createdAt y updatedAt automáticamente
        versionKey: false,
    }
);

// Generamos código interno antes de crear el doc (si no viene del DTO)
PetSchema.pre("save", function (next) {
    if (!this.internalCode) {
        this.internalCode = crypto.randomBytes(8).toString("hex");
    }
    next();
});

export const PetModel = mongoose.model("Pet", PetSchema);
