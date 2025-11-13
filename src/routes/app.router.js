import CustomRouter from "./custom.router.js";
import apiRouter from "./api.router.js";
import viewsRouter from "./views.router.js";

class AppRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }

    init = () => {
        this.use("/", viewsRouter);
        this.use("/api", apiRouter);
    };
}

const appRouter = new AppRouter().getRouter();

export default appRouter;
