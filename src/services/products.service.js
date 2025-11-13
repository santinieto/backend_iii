import productRepository from "../repositories/products.repository.js";
import { Service } from "./base.service.js";

export const productService = new Service(productRepository);
