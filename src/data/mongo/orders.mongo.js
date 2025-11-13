import MongoManager from "./manager.mongo.js";
import Orden from "./models/orders.model.js";

class OrdersManager extends MongoManager {
    constructor() {
        super(Orden);
    }
}

const ordersManager = new OrdersManager();
export { ordersManager };
