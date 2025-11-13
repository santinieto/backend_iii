import { ordersManager } from "../data/dao.factory.js";
import OrderDTO from "../dto/orders.dto.js";
import BaseRepository from "./base.repository.js";

const orderRepository = new BaseRepository({
    manager: ordersManager,
    DTO: OrderDTO,
    createFn: ordersManager.createOne,
    updateFn: ordersManager.updateById,
});

export default orderRepository;
