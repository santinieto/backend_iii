import { verifyToken } from "../helpers/token.helper.js";

const setupPolicies = (policies) => async (req, res, next) => {
    try {
        // Si no tengo policies, retorno 200
        if (!policies) {
            return next();
        }

        if (!Array.isArray(policies)) {
            console.log("Policies no es un array", policies);
            return res.json400("Policies must me an array");
        }

        // Si no tengo policies, retorno 200
        if (policies.length === 0) {
            return next();
        }

        // Paso a mayusculas las policies para que sea case insensitive
        const normalizedPolicies = policies.map((policy) =>
            policy.toUpperCase()
        );

        // Si el recurso es publico no tengo que hacer mas nada
        if (normalizedPolicies.includes("PUBLIC")) {
            return next();
        }

        // Si el recurso es privado y no tengo token, retorno 401
        const token = req?.cookies?.token;
        if (!token) {
            return res.json401("No token provided");
        }

        const data = verifyToken(token);
        const { role, user_id } = data;
        if (!role || !user_id) {
            return res.json401();
        }

        // Paso a mayusculas el rol para que sea case insensitive
        const roleUpper = role.toUpperCase();

        // Roles disponibles
        const roles = {
            USER: normalizedPolicies.includes("USER"),
            ADMIN: normalizedPolicies.includes("ADMIN"),
        };

        // Si el usuario tiene el rol requerido, lo guardo en el req y
        // sigo con la siguiente funcion
        if (roles[roleUpper]) {
            req.user = data;
            return next();
        } else {
            res.json403();
        }
    } catch (error) {
        next(error);
    }
};

export default setupPolicies;
