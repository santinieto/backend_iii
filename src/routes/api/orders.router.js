import CustomRouter from "../custom.router.js";
import { cidParam, oidParam } from "../../middlewares/params.mid.js";

import {
    createOne,
    createOneFromCart,
    readAll,
    readOne,
    updateOne,
    deleteOne,
} from "../../controllers/orders.controller.js"; // Importamos los controladores

class OrdersRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }

    init = () => {
        this.create("/", ["admin"], createOne);
        this.create("/:cid", ["public"], createOneFromCart);
        this.read("/", ["public"], readAll);
        this.read("/:oid", ["public"], readOne);
        this.update("/:oid", ["public"], updateOne);
        this.delete("/:oid", ["public"], deleteOne);
        this.param("cid", cidParam);
        this.param("oid", oidParam);
    };
}

const ordersRouter = new OrdersRouter().getRouter();

export default ordersRouter;
