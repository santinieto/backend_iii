import { productService } from "../services/products.service.js";

export const readAll = async (req, res) => {
    const products = await productService.readAll();
    if (!products || products.length === 0) {
        return res.json404();
    }
    res.json200(products);
};

export const readOne = async (req, res) => {
    const { pid } = req.params;
    const product = await productService.readOne(pid);

    if (!product) {
        return res.json404();
    }

    res.json200(product);
};

export const createOne = async (req, res) => {
    const requiredFields = [
        "name",
        "price",
        "discount",
        "category",
        "description",
        "stock",
        "code",
        "status",
    ];

    const missingFields = requiredFields.filter(
        (field) => !(field in req.body)
    );

    if (missingFields.length > 0) {
        return res.json400(`Faltan campos: ${missingFields.join(", ")}`);
    }

    const newProduct = await productService.createOne(req.body);
    if (!newProduct) {
        return res.json500("Error al crear el producto");
    }

    res.json201(newProduct, "Producto creado correctamente.");
};

export const updateOne = async (req, res) => {
    const updatedProduct = await productService.updateOne(
        req.params.pid,
        req.body
    );
    if (!updatedProduct) {
        return res.json400("Error al actualizar el producto");
    }

    res.json200(updatedProduct, "Producto actualizado correctamente.");
};

export const deleteOne = async (req, res) => {
    const deleted = await productService.deleteOne(req.params.pid);
    if (!deleted) {
        return res.json404();
    }

    res.json200({}, "Producto eliminado correctamente.");
};
