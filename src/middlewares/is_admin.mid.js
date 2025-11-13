import { verifyToken } from "../helpers/token.helper.js";
import { usersManager } from "../data/manager.mongo.js";

export const isAdmin = async (req, res, next) => {
    try {
        const headers = req?.headers?.authorization;
        if (!headers || !headers.startsWith("Bearer")) {
            const error = new Error("Token no valido");
            error.status = 401;
            throw error;
        }
        // console.log("headers", headers);

        // Extraigo el token del header
        const token = headers.split(" ")[1];
        if (!token || token == "null") {
            const error = new Error("Token no valido");
            error.status = 401;
            throw error;
        }
        // console.log("token:", token);

        const data = verifyToken(token);
        if (!data) {
            const error = new Error("Token no valido");
            error.status = 401;
            throw error;
        }
        // console.log(data);

        // Con el id del usuario, lo busco en la base de datos
        const user = await usersManager.readById(data.user_id);
        req.user = user;
        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.status = 401;
            throw error;
        }

        // Verifico si el usuario es admin
        if (!user.role || user.role.toUpperCase() !== "admin".toUpperCase()) {
            const error = new Error(
                "No tiene permisos para acceder a este recurso"
            );
            error.status = 403;
            throw error;
        }

        next(null, user);
    } catch (error) {
        next(error);
    }
};
