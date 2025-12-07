import CustomRouter from "./custom.router.js";
import authRouter from "./api/auth.router.js";
import cartsRouter from "./api/carts.router.js";
import productsRouter from "./api/products.router.js";
import mailingRouter from "./api/mailing.router.js";
import ordersRouter from "./api/orders.router.js";
import forksRouter from "./api/forks.router.js";
import mocksRouter from "./api/mocks.router.js";

class ApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }

    init = () => {
        this.use("/auth", authRouter);
        this.use("/carts", cartsRouter);
        this.use("/products", productsRouter);
        this.use("/mailing", mailingRouter);
        this.use("/orders", ordersRouter);
        this.use("/forks", forksRouter);
        this.use("/mocks", mocksRouter)
    };
}

const apiRouter = new ApiRouter().getRouter();

export default apiRouter;
