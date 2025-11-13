import CustomRouter from "../custom.router.js";
import { cidParam } from "../../middlewares/params.mid.js";
import {
    createOne,
    readAll,
    readOne,
    addProductToCart,
    updateOne,
    deleteOne,
} from "../../controllers/carts.controller.js"; // Importamos los controladores

class CartsRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }

    init = () => {
        this.create("/create", ["user", "admin"], createOne);
        this.read("/", ["admin"], readAll);
        this.read("/:cid", ["user", "admin"], readOne);
        this.update("/:cid", ["user", "admin"], updateOne);
        this.delete("/:cid", ["admin"], deleteOne);
        this.create("/add-product", ["user", "admin"], addProductToCart);
        this.param("cid", cidParam);
    };
}

const cartsRouter = new CartsRouter().getRouter();

export default cartsRouter;
