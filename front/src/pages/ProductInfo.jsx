import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductInfo = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [cartId, setCartId] = useState("");
    const [loading, setLoading] = useState(true);
    const [carts, setCarts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8080/api/products/${productId}`,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                setProduct(res.data.response);
            } catch (err) {
                console.error("Error fetching product:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchCarts = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/carts", {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                setCarts(res.data.response);
            } catch (err) {
                console.error("Error al obtener carritos:", err);
            }
        };

        fetchProduct();
        fetchCarts();
    }, []);

    const handleAddToCart = async () => {
        if (!cartId) {
            alert(
                "Por favor, seleccione un carrito antes de agregar productos."
            );
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/api/carts/add-product`,
                {
                    cart_id: cartId,
                    product_id: productId,
                    quantity: 1,
                },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            if (response.data.code === 200) {
                alert("Producto agregado al carrito correctamente.");
                window.location.href = `/carts/${cartId}`;
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            console.error("Error al agregar producto al carrito:", err);
            alert("Hubo un error al intentar agregar el producto al carrito.");
        }
    };

    if (loading) {
        return <div className="text-center mt-10">Cargando producto...</div>;
    }

    if (!product) {
        return (
            <div className="text-center mt-10 text-red-500">
                Producto no encontrado.
            </div>
        );
    }

    return (
        <div className="container mx-auto mt-10 px-4">
            <div className="bg-white shadow-md rounded p-6">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Información del producto {product._id}
                </h1>

                <div className="flex flex-wrap justify-center gap-6">
                    <div className="w-full md:w-96">
                        <div className="shadow rounded overflow-hidden">
                            <img
                                src={
                                    product.thumbnails
                                        ? `/img/${product.thumbnails}`
                                        : "/img/image-not-found.jpg"
                                }
                                alt={`Imagen de ${product.name}`}
                                className="w-full h-96 object-cover cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">
                                    {product.name} ({product._id})
                                </h2>
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
                                    <strong>Estado:</strong>{" "}
                                    <span
                                        className={`inline-block px-2 py-1 rounded text-white text-sm ${
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
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-col items-center space-y-4">
                    <select
                        value={cartId}
                        onChange={(e) => setCartId(e.target.value)}
                        className="border p-2 rounded w-64"
                    >
                        <option value="">Seleccione un carrito</option>
                        {carts.map((cart) => (
                            <option key={cart._id} value={cart._id}>
                                Carrito {cart._id}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleAddToCart}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Agregar al carrito
                    </button>

                    <a href="/products" className="text-blue-500 underline">
                        Volver a productos
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;
