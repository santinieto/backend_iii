import CustomRouter from "../custom.router.js";
import { pidParam } from "../../middlewares/params.mid.js";

import {
    readAll,
    readOne,
    createOne,
    updateOne,
    deleteOne,
} from "../../controllers/products.controller.js"; // Importamos los controladores


class ProductsRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }

    init = () => {
        this.create("/", ["admin"], createOne);
        this.read("/", ["public"], readAll);
        this.read("/:pid", ["public"], readOne);
        this.update("/:pid", ["admin"], updateOne);
        this.delete("/:pid", ["admin"], deleteOne);
        this.param("pid", pidParam);
    };
}

const productsRouter = new ProductsRouter().getRouter();

export default productsRouter;
