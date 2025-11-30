import express from "express";
import { engine } from "express-handlebars";
import "./helpers/set_env.helper.js";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import appRouter from "./routes/app.router.js";
import errorHandler from "./middlewares/error_handler.js";
import pathHandler from "./middlewares/path_handler.mid.js";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Variables globabes
const PORT = process.env.PORT || 8080; // Puerto por defecto
const ENV = process.env.ENV || "prd"; // Ambiente por defecto

// Creo el objeto Server
const server = express();
const ready = () => {
    // Inicializo el servidor
    console.log(
        `Servidor inicializado en el http://localhost:${PORT} - Ambiente ${ENV}`
    );
};

// Configuraciones del servidor
server.use(express.json()); // Habilitar la lectura de cuerpos JSON
server.use(morgan("dev")); // Logger para ver las peticiones en consola
server.use(cookieParser(process.env.COOKIE_KEY)); // Middleware para leer cookies
server.use(express.urlencoded({ extended: true })); // Middleware para leer datos de formularios
server.use(compression());
server.use(helmet());
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

// Endpoints
server.use("/", appRouter);
server.use(errorHandler);
server.use(pathHandler);

// Inicializo el servidor
server.listen(PORT, ready);
