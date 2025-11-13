import React, { useEffect, useState } from "react";
import axios from "axios";

const DeleteProduct = () => {
    const [products, setProducts] = useState([]);
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuthAndLoadProducts = async () => {
            try {
                const authResponse = await axios.get(
                    "http://localhost:8080/api/auth/delete-product",
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );

                if (authResponse.data.status === "success") {
                    const productResponse = await axios.get(
                        "http://localhost:8080/api/products",
                        {
                            headers: { "Content-Type": "application/json" },
                            withCredentials: true,
                        }
                    );

                    if (productResponse.data.code === 200) {
                        setProducts(productResponse.data.response);
                    } else {
                        setError("Error al obtener la lista de productos.");
                    }
                } else {
                    handleAuthError(authResponse.data.code);
                }
            } catch (err) {
                setError(
                    "Hubo un error al cargar el panel. Inténtalo de nuevo más tarde."
                );
            }
        };

        const handleAuthError = (code) => {
            if (code === 401) {
                alert("No hay usuarios logeados.");
                window.location.replace("/login");
            } else if (code === 403) {
                setError(
                    "El usuario no tiene permisos para acceder al panel de control."
                );
            } else {
                setError("Hubo un error al cargar el panel.");
            }
        };

        checkAuthAndLoadProducts();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/api/products/${id}`,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (response.data.code === 200) {
                alert("Producto eliminado con éxito.");
                window.location.replace("/products");
            } else {
                alert("Error al eliminar el producto.");
            }
        } catch (err) {
            alert("Error al eliminar el producto.");
        }
    };

    return (
        <div className="container mx-auto mt-10 px-4 max-w-4xl">
            <div className="bg-white shadow-md rounded p-6">
                <div className="bg-red-600 text-white text-center py-3 rounded mb-5">
                    <h1 className="text-xl font-bold">
                        Eliminación de productos
                    </h1>
                </div>

                {error ? (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                        {error}
                    </div>
                ) : (
                    <>
                        <select
                            className="w-full p-2 border rounded mb-5"
                            onChange={(e) =>
                                setSelected(products[e.target.value])
                            }
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Selecciona un producto
                            </option>
                            {products.map((product, index) => (
                                <option key={product._id} value={index}>
                                    {product.name}
                                </option>
                            ))}
                        </select>

                        {selected && (
                            <div className="bg-gray-50 border rounded shadow p-4">
                                <h2 className="text-lg font-semibold text-blue-600 mb-4">
                                    Información del Producto
                                </h2>
                                <ul className="space-y-1 text-sm">
                                    <li>
                                        <strong>ID:</strong> {selected._id}
                                    </li>
                                    <li>
                                        <strong>Código:</strong> {selected.code}
                                    </li>
                                    <li>
                                        <strong>Nombre:</strong> {selected.name}
                                    </li>
                                    <li>
                                        <strong>Precio:</strong> $
                                        {selected.price}
                                    </li>
                                    <li>
                                        <strong>Descuento:</strong>{" "}
                                        {selected.discount}%
                                    </li>
                                    <li>
                                        <strong>Categoría:</strong>{" "}
                                        {selected.category}
                                    </li>
                                    <li>
                                        <strong>Descripción:</strong>{" "}
                                        {selected.description ||
                                            "Sin descripción"}
                                    </li>
                                    <li>
                                        <strong>Stock:</strong> {selected.stock}
                                    </li>
                                    <li>
                                        <strong>Estado:</strong>{" "}
                                        {selected.status}
                                    </li>
                                    <li>
                                        <strong>Creado el:</strong>{" "}
                                        {new Date(
                                            selected.createdAt
                                        ).toLocaleString()}
                                    </li>
                                    <li>
                                        <strong>Actualizado el:</strong>{" "}
                                        {new Date(
                                            selected.updatedAt
                                        ).toLocaleString()}
                                    </li>
                                    <li>
                                        <strong>Thumbnails:</strong>{" "}
                                        {selected.thumbnails}
                                    </li>
                                </ul>

                                <div className="flex justify-end mt-6">
                                    <button
                                        onClick={() =>
                                            handleDelete(selected._id)
                                        }
                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
                                    >
                                        Eliminar Producto
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DeleteProduct;
