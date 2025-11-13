import { usersManager } from "../data/dao.factory.js";

export const register = async (req, res) => {
    res.status(201).json({
        response: req.user._id, // Respondemos solo con el ID del usuario registrado
        method: req.method,
        url: req.originalUrl,
        status: "success",
    });
};

export const verifyAccount = async (req, res) => {
    const { email, verificationCode } = req.body;
    const user = await usersManager.readBy({ email, verificationCode });
    if (!user) {
        res.json401("Error al verificar cuenta");
    }
    await usersManager.updateById(user._id, { isVerified: true });
    res.status(200).json({
        response: `Usuario ${user._id} verificado correctamente`,
        method: req.method,
        url: req.originalUrl,
        status: "success",
    });
};

export const login = async (req, res) => {
    res.cookie("token", req.token, {
        maxAge: 1000 * 60 * 60, // 1 hora
        httpOnly: true, // Solo el servidor puede acceder a la cookie
    })
        .status(200)
        .json({
            response: req.token, // Respondemos con el usuario de acceso
            method: req.method,
            url: req.originalUrl,
            status: "success",
        });
};

export const logout = async (req, res) => {
    res.clearCookie("token").status(200).json({
        response: "Logout exitoso!",
        method: req.method,
        url: req.originalUrl,
        status: "success",
    });
};

export const profile = async (req, res) => {
    const user = req.user;
    res.status(200).json({
        response: user,
        method: req.method,
        url: req.originalUrl,
        status: "success",
    });
};

export const controlPanel = async (req, res) => {
    const user = req.user;
    res.status(200).json({
        response: user,
        method: req.method,
        url: req.originalUrl,
        status: "success",
    });
};

export const navigationBar = async (req, res) => {
    const user = req.user;
    res.status(200).json({
        response: user,
        method: req.method,
        url: req.originalUrl,
        status: "success",
    });
};

export const deleteProduct = async (req, res) => {
    const user = req.user;
    res.status(200).json({
        response: user,
        method: req.method,
        url: req.originalUrl,
        status: "success",
    });
};

export const updateProduct = async (req, res) => {
    const user = req.user;
    res.status(200).json({
        response: user,
        method: req.method,
        url: req.originalUrl,
        status: "success",
    });
};
