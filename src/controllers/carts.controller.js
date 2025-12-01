import { cartService } from "../services/carts.service.js";
import { getLogger } from "../helpers/logger.helper.js";

const logger = getLogger("carts");

export const createOne = async (req, res) => {
    logger.debug("Entrando en el controlador de creación de carrito");

    const { products } = req.body;

    if (!Array.isArray(products)) {
        return res.json400("El campo 'products' debe ser un arreglo válido.");
    }

    const newCart = await cartService.createOne(products);
    if (!newCart) {
        return res.json500("Error al crear el carrito.");
    }

    res.json201(newCart, "Carrito creado correctamente.");
};

export const readAll = async (req, res) => {
    logger.debug("Entrando en el controlador de lectura de todos los carritos");

    const carts = await cartService.readAll();
    if (!carts || carts.length === 0) {
        return res.json404("No se encontraron carritos.");
    }
    res.json200(carts);
};

export const readOne = async (req, res) => {
    logger.debug("Entrando en el controlador de lectura de un carrito");

    const { cid } = req.params;
    const cart = await cartService.readOne(cid);

    if (!cart) {
        return res.json404();
    }

    res.status(200).json(cart);
};

export const addProductToCart = async (req, res) => {
    logger.debug("Entrando en el controlador de agregar producto al carrito");

    const { cart_id, product_id, quantity } = req.body;
    const result = await cartService.addProductToCart(
        cart_id,
        product_id,
        quantity
    );

    if (result.status === "error") {
        return res.json400(result.message);
    }

    res.json200(result.cart, "Producto agregado al carrito correctamente.");
};

export const updateOne = async (req, res) => {
    logger.debug("Entrando en el controlador de actualización de carrito");

    const { cid } = req.params;
    const { products } = req.body;

    const result = await cartService.updateOne(cid, products);
    if (result.status === "error") {
        return res.json400(result.message);
    }

    res.json200(result.cart, "Carrito actualizado correctamente.");
};

export const deleteOne = async (req, res) => {
    logger.debug("Entrando en el controlador de eliminación de carrito");

    const { cid } = req.params;
    const deleted = await cartService.deleteOne(cid);
    if (!deleted) {
        return res.json404("No se encontró el carrito.");
    }

    res.json200(deleted, "Carrito eliminado correctamente.");
};
