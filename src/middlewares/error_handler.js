import { getLogger } from "../helpers/logger.helper.js";

const logger = getLogger("error");

const errorHandler = (error, req, res, next) => {
    logger.error("🔴 Error capturado:", error);

    const message = error.message || "Internal server error";

    // Nos aseguramos de que el status sea un número válido
    const status =
        typeof error.status === "number"
            ? error.status
            : typeof error.statusCode === "number"
            ? error.statusCode
            : 500;

    const data = {
        method: req.method,
        url: req.originalUrl,
        code: error.code,
        status: "error",
        message,
    };
    res.status(status).json(data);
};

export default errorHandler;
