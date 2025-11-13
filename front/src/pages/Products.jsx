import React, { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [cartIds, setCartIds] = useState([]);
    const [selectedCart, setSelectedCart] = useState("");

    const fetchProducts = async (page = 1) => {
        try {
            const res = await axios.get(
                `http://localhost:8080/api/products?page=${page}&limit=${products.limit}`,
                {
                    withCredentials: true,
                }
            );
            setProducts(res.data.response);
        } catch (err) {
            console.error("Error al obtener productos", err);
        }
    };

    const fetchCartIds = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/carts", {
                withCredentials: true,
            });
            const carts = res.data.response || [];
            const cartIds = carts.map((cart) => cart._id);
            setCartIds(cartIds);
        } catch (err) {
            console.error("Error al obtener carritos", err);
        }
    };

    const goToProduct = (productId) => {
        window.location.href = `/products/${productId}`;
    };

    const addToCart = async (productId) => {
        if (!selectedCart) {
            alert(
                "Por favor, seleccione un carrito antes de agregar productos."
            );
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:8080/api/carts/add-product",
                {
                    cart_id: selectedCart,
                    product_id: productId,
                    quantity: 1,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            if (res.data.code === 200) {
                alert("Producto agregado al carrito correctamente.");
                window.location.href = `/carts/${selectedCart}`;
            } else {
                throw new Error(res.data.message);
            }
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            alert(
                `Hubo un error al intentar agregar el producto al carrito. ${error.message}`
            );
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCartIds();
    }, []);

    return (
        <div className="container mx-auto mt-10 px-4">
            <div className="bg-white shadow-md rounded p-6 text-center">
                <h1 className="text-3xl font-bold mb-6">CoderShop</h1>
            </div>

            <div className="mt-4">
                <label
                    htmlFor="cart-select"
                    className="block text-sm font-medium mb-1"
                >
                    Selecciona un carrito:
                </label>
                <select
                    id="cart-select"
                    className="w-full p-2 border rounded"
                    value={selectedCart}
                    onChange={(e) => setSelectedCart(e.target.value)}
                >
                    <option value="">Seleccione un carrito</option>
                    {cartIds.map((id) => (
                        <option key={id} value={id}>
                            Carrito {id}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-6 border p-4 rounded bg-white flex flex-wrap gap-6 overflow-y-auto">
                {products.map((product) => (
                    <div key={product._id} className="w-full md:w-1/3">
                        <div className="bg-white rounded shadow">
                            <img
                                src={
                                    product.thumbnails
                                        ? `/img/${product.thumbnails}`
                                        : "/img/image-not-found.jpg"
                                }
                                alt={`Imagen de ${product.name}`}
                                className="w-full h-[400px] object-cover rounded-t"
                            />
                            <div className="p-4">
                                <h5 className="text-xl font-bold mb-2">
                                    {product.name} ({product._id})
                                </h5>
                                <p>
                                    <strong>Categoría:</strong>{" "}
                                    {product.category}
                                </p>
                                <p>
                                    <strong>Descripción:</strong>{" "}
                                    {product.description}
                                </p>
                                <p>
                                    <strong>Precio:</strong> ${product.price}
                                </p>
                                <p>
                                    <strong>Descuento:</strong>{" "}
                                    {product.discount}%
                                </p>
                                <p>
                                    <strong>Stock:</strong> {product.stock}{" "}
                                    unidades
                                </p>
                                <p>
                                    <strong>Código:</strong> {product.code}
                                </p>
                                <p>
                                    <strong>Estado:</strong>
                                    <span
                                        className={`ml-2 px-2 py-1 rounded text-white text-sm ${
                                            product.status
                                                ? "bg-green-600"
                                                : "bg-red-600"
                                        }`}
                                    >
                                        {product.status
                                            ? "Disponible"
                                            : "Agotado"}
                                    </span>
                                </p>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => goToProduct(product._id)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                    >
                                        Más información
                                    </button>
                                    <button
                                        onClick={() => addToCart(product._id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                    >
                                        Agregar al carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 border p-4 rounded bg-white flex justify-center items-center gap-4">
                {products.hasPrevPage && (
                    <button
                        onClick={() => fetchProducts(products.prevPage)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Página anterior
                    </button>
                )}
                <span>
                    Página {products.page} de {products.totalPages}
                </span>
                {products.hasNextPage && (
                    <button
                        onClick={() => fetchProducts(products.nextPage)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Página siguiente
                    </button>
                )}
            </div>
        </div>
    );
};

export default Products;
