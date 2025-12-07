import CustomRouter from "../custom.router.js";
import {
    createUsers,
    createPets,
    generateData,
} from "../../controllers/mocks.controller.js";

class MocksRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }

    init = () => {
        this.read("/mockingusers", ["public"], createUsers);
        this.read("/mockingpets", ["public"], createPets);
        this.read("/generateData", ["public"], generateData);
    };
}

const mocksRouter = new MocksRouter().getRouter();
export default mocksRouter;
