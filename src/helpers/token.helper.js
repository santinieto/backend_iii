import jwt from "jsonwebtoken";

export const createToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        return token;
    } catch (error) {
        error.status = "error";
        throw error;
    }
};

export const decodeToken = (headers) => {
    try {
        // Valido el token
        const authHeader = headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("Token no valido");
        }

        // Extraigo el token del header
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        error.status = "error";
        throw error;
    }
};

export const verifyToken = (token) => {
    try {
        // Verifico el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        error.status = "error";
        throw error;
    }
};
