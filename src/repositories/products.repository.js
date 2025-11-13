import { productsManager } from "../data/dao.factory.js";
import ProductDTO from "../dto/products.dto.js";
import BaseRepository from "./base.repository.js";

const productRepository = new BaseRepository({
    manager: productsManager,
    DTO: ProductDTO,
    createFn: productsManager.createOne,
    updateFn: productsManager.updateById,
});

export default productRepository;
