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
        console.log("Conectando a la base de datos...");
        try {
            await connect(this.url, { maxPoolSize: 10 });
            console.log("Conectado a MongoDB");
        } catch (error) {
            console.error("Error al conectar a MongoDB:", error);
        }
    }
}
