import { ordersService } from "../services/orders.service.js";
import { cartService } from "../services/carts.service.js";

export const readAll = async (req, res) => {
    const orders = await ordersService.readAll();
    if (!orders || orders.length === 0) {
        return res.json404();
    }
    res.json200(orders);
};

export const createOne = async (req, res) => {
    const requiredFields = [
        "cart_id",
        "products",
        "total",
        "paymentMethod",
        "shippingAddress",
    ];

    const missingFields = requiredFields.filter(
        (field) => !(field in req.body)
    );

    if (missingFields.length > 0) {
        return res.json400(`Faltan campos: ${missingFields.join(", ")}`);
    }

    const newOrder = await ordersService.createOne(req.body);
    if (!newOrder) {
        return res.json500("Error al crear la orden");
    }

    res.json201(newOrder, "Orden creada correctamente.");
};

export const createOneFromCart = async (req, res) => {
    const { cid } = req.params;

    const cart = await cartService.getDetailedCart(cid);
    if (!cart) return res.json404("Carrito no encontrado");

    const orderBody = {
        cart_id: cid,
        products: cart.products,
        total: cart.total,
        payment_method: "credit_card",
        shipping_address: "123 Calle Falsa, Ciudad",
    };

    const newOrder = await ordersService.createOne(orderBody);
    if (!newOrder) {
        return res.json500("Error al crear la orden");
    }

    res.json201(newOrder, "Orden creada correctamente.");
};

export const readOne = async (req, res) => {
    const { oid } = req.params;
    const order = await ordersService.readOne(oid);

    if (!order) {
        return res.json404();
    }

    res.json200(order);
};

export const updateOne = async (req, res) => {
    const updatedOrder = await ordersService.updateOne(
        req.params.oid,
        req.body
    );
    if (!updatedOrder) {
        return res.json400("Error al actualizar la orden");
    }

    res.json200(updatedOrder, "Orden actualizada correctamente.");
};

export const deleteOne = async (req, res) => {
    const deleted = await ordersService.deleteOne(req.params.oid);
    if (!deleted) {
        return res.json404();
    }

    res.json200({}, "Orden eliminada correctamente.");
};
