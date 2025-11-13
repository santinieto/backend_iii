import ordersRepository from "../repositories/orders.repository.js";
import { Service } from "./base.service.js";

export const ordersService = new Service(ordersRepository);
