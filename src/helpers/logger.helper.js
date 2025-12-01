import log4js from "log4js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración básica de log4js
log4js.configure({
    appenders: {
        out: { type: "console" },
        fileAll: { type: "file", filename: path.join(__dirname, "..", "logs", "app.log") },
        fileErr: { type: "file", filename: path.join(__dirname, "..", "logs", "error.log") },
    },
    categories: {
        default: { appenders: ["out", "fileAll"], level: process.env.LOG_LEVEL || "info" },
        error: { appenders: ["fileErr", "out"], level: "error" },
    },
});

// Exportamos una función para obtener loggers por categoría
export const getLogger = (category = "default") => log4js.getLogger(category);

// Exportar logger por default
export default getLogger();
