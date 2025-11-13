import FileSystemManager from "./manager.fs.js";

const productsFilePath = "./data/products.json";

class ProductsManager extends FileSystemManager {
    constructor() {
        super(productsFilePath).ensureFileExists();
    }

    createProduct = async (data) => {
        await this.createOne(data);
        return product;
    };

    getPaginatedProducts = async (page = 1, limit = 10, sort = "asc") => {
        const allProducts = await this.readAll();
        const sorted = allProducts.sort((a, b) =>
            sort === "asc" ? a.price - b.price : b.price - a.price
        );

        const start = (page - 1) * limit;
        const end = start + limit;
        const paginated = sorted.slice(start, end);

        return {
            docs: paginated,
            totalDocs: allProducts.length,
            limit,
            page,
            totalPages: Math.ceil(allProducts.length / limit),
            hasPrevPage: page > 1,
            hasNextPage: end < allProducts.length,
        };
    };
}

const productsManager = new ProductsManager();
export { productsManager };
