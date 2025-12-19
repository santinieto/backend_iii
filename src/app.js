import express from "express";
import { engine } from "express-handlebars";
import "./helpers/set_env.helper.js";
import cors from "cors";
import morgan from "morgan";
import log4js from "log4js";
import logger, { getLogger } from "./helpers/logger.helper.js";
import cookieParser from "cookie-parser";
import appRouter from "./routes/app.router.js";
import errorHandler from "./middlewares/error_handler.js";
import pathHandler from "./middlewares/path_handler.mid.js";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cluster from "cluster";
import { cpus } from "os";

// Variables globabes
const PORT = process.env.PORT || 8080; // Puerto por defecto
const ENV = process.env.ENV || "prd"; // Ambiente por defecto

// Creo el objeto Server
const server = express();
const ready = () => {
    // Inicializo el servidor
    logger.info(
        `Servidor inicializado en el http://localhost:${PORT} - Ambiente ${ENV} - PID worker ${process.pid}`
    );
};

// Configuraciones del servidor
server.use(express.json()); // Habilitar la lectura de cuerpos JSON
server.use(morgan("dev")); // Logger para ver las peticiones en consola
// Integración de log4js para logging de requests
server.use(log4js.connectLogger(getLogger("default"), { level: "auto" }));
server.use(cookieParser(process.env.COOKIE_KEY)); // Middleware para leer cookies
server.use(express.urlencoded({ extended: true })); // Middleware para leer datos de formularios
server.use(compression());
server.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                // permitimos scripts desde nuestro dominio y desde jsDelivr
                "script-src": ["'self'", "https://cdn.jsdelivr.net"],
                // permitimos estilos (CSS) desde nuestro dominio y desde jsDelivr
                "style-src": ["'self'", "https://cdn.jsdelivr.net"],
                // fuentes si las trae el CDN
                "font-src": ["'self'", "https://cdn.jsdelivr.net"],
                // imágenes locales + data URIs
                "img-src": ["'self'", "data:"],
                // ajustá o agregá directives según necesites
            },
        },
    })
);
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 100, // Limite de 100 peticiones por IP
    standardHeaders: true,
    legacyHeaders: false,
});
server.use(limiter);

server.use(
    cors({
        origin: process.env.CORS_ORIGIN || true, // Usa variable de entorno o permite todo por defecto (dev)
        credentials: true, // Habilita el envio de Cookies
    })
);

// Configurar ruta publica
server.use(express.static("public"));

// Handlebars
server.engine("handlebars", engine()); // Como va a ser la extension de los archivos
server.set("view engine", "handlebars"); // Seteo
server.set("views", "./src/views"); // Donde tiene que buscar las vistas

// Cluster mode
if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    const numCPUs = process.env.NUM_CPUS || cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(
            `worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`
        );
        cluster.fork(); // Reinicio el worker
    });
} else {
    // Endpoints
    server.use("/", appRouter);
    server.use(errorHandler);
    server.use(pathHandler);

    // Inicializo el servidor
    server.listen(PORT, ready);
}
