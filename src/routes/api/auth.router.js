import CustomRouter from "../custom.router.js";
import passportCallback from "../../middlewares/passport_callback.mid.js"; // Importamos el middleware de passport
import {
    register,
    verifyAccount,
    login,
    logout,
    profile,
    controlPanel,
    navigationBar,
    deleteProduct,
    updateProduct,
} from "../../controllers/auth.controller.js"; // Importamos los controladores

class AuthRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }

    init = () => {
        this.create(
            "/register",
            ["public"],
            passportCallback("register"),
            register
        );
        this.create("/verify-account", ["public"], verifyAccount);
        this.create("/login", ["public"], passportCallback("login"), login);
        this.read(
            "/profile",
            ["user", "admin"],
            passportCallback("current"),
            profile
        );
        this.read(
            "/logout",
            ["public", "admin"],
            passportCallback("current"),
            logout
        );
        this.read(
            "/control-panel",
            ["admin"],
            passportCallback("admin"),
            controlPanel
        );
        this.read(
            "/navbar",
            ["public"],
            passportCallback("current"),
            navigationBar
        );
        this.read(
            "/delete-product",
            ["public"],
            passportCallback("admin"),
            deleteProduct
        );
        this.read(
            "/update-product",
            ["public"],
            passportCallback("admin"),
            updateProduct
        );
    };
}

const authRouter = new AuthRouter().getRouter();

export default authRouter;
