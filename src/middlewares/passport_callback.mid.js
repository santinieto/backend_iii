import passport from "./passport.mid.js"; // Importamos el middleware de passport

const passportCallback = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                const error = new Error(
                    info.message || "Usuario no encontrado"
                );
                error.status = info.status || 401;
                return next(error);
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};

export default passportCallback;
