import MongoManager from "./manager.mongo.js";
import Product from "./models/products.model.js";

class ProductsManager extends MongoManager {
    constructor() {
        super(Product);
    }
    getPaginatedProducts = async (page, limit, sort) => {
        const products = await this.model.paginate(
            {},
            {
                page: page,
                limit: limit,
                sort: { price: sort === "asc" ? 1 : -1 },
                lean: true,
            }
        );
        return products;
    };
}

const productsManager = new ProductsManager();
export { productsManager };
