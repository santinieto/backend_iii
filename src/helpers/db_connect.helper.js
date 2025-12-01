import { connect } from "mongoose";
import { getLogger } from "./logger.helper.js";

const logger = getLogger("db");

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
        logger.info("Conectando a la base de datos...");
        try {
            await connect(this.url, { maxPoolSize: 10 });
            logger.info("Conectado a MongoDB");
        } catch (error) {
            logger.error("Error al conectar a MongoDB:", error);
        }
    }
}
