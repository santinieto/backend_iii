import { connect } from "mongoose";

export class DatabaseConnect {
    static instance;

    constructor(url) {
        if (DatabaseConnect.instance) {
            return DatabaseConnect.instance;
        }

        this.url = url;
        DatabaseConnect.instance = this;
    }

    async connectToDatabase() {
        try {
            await connect(this.url);
            console.log("Conectado a MongoDB");
        } catch (error) {
            console.error("Error al conectar a MongoDB:", error);
        }
    }
}
