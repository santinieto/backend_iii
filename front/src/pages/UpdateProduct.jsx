import { useEffect, useState } from "react";
import axios from "axios";

const UpdateProduct = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkPermissionsAndLoadProducts = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8080/api/auth/update-product",
                    {
                        withCredentials: true,
                    }
                );

                if (res.data.status === "success") {
                    const productsRes = await axios.get(
                        "http://localhost:8080/api/products",
                        {
                            withCredentials: true,
                        }
                    );

                    if (productsRes.data.code === 200) {
                        setProducts(productsRes.data.response);
                    }
                } else {
                    if (res.data.code === 401) {
                        alert("No hay usuarios logeados");
                        window.location.replace("/login");
                    } else if (res.data.code === 403) {
                        setError(
                            "El usuario no tiene permisos para acceder al panel de control."
                        );
                    } else {
                        setError(
                            "Hubo un error al cargar el panel. Inténtalo de nuevo más tarde."
                        );
                    }
                }
            } catch (err) {
                console.error("Error al cargar el panel de control:", err);
                setError(
                    "Hubo un error al cargar el panel. Inténtalo de nuevo más tarde."
                );
            }
        };

        checkPermissionsAndLoadProducts();
    }, []);

    const handleSelectChange = (e) => {
        const index = e.target.value;
        setSelectedProduct(products[index]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedProduct = {
            id: selectedProduct._id,
            name: e.target.name.value,
            price: parseFloat(e.target.price.value),
            description: e.target.description.value,
            code: selectedProduct.code,
            category: e.target.category.value,
            stock: parseInt(e.target.stock.value),
            discount: parseFloat(e.target.discount.value),
            thumbnails: e.target.thumbnail.value,
            status: e.target.status.checked,
        };

        try {
            const res = await axios.put(
                `http://localhost:8080/api/products/${selectedProduct._id}`,
                updatedProduct,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (res.data.code === 200) {
                alert("Producto actualizado correctamente.");
                window.location.replace("/products");
            } else {
                alert("Error al actualizar el producto.");
            }
        } catch (err) {
            console.error("Error al actualizar el producto:", err);
            alert("Error de red al intentar actualizar el producto.");
        }
    };

    return (
        <div className="container mx-auto mt-10 max-w-3xl">
            <div className="bg-white shadow-md rounded p-6">
                <div className="bg-blue-600 text-white px-4 py-3 rounded-t">
                    <h1 className="text-xl font-bold text-center">
                        Actualización de productos
                    </h1>
                </div>

                {error && (
                    <div className="mt-4 bg-red-100 text-red-800 p-3 rounded">
                        {error}
                    </div>
                )}

                {!error && products.length > 0 && (
                    <>
                        <div className="mt-6">
                            <select
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                onChange={handleSelectChange}
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
                        </div>

                        {selectedProduct && (
                            <form
                                onSubmit={handleSubmit}
                                className="mt-6 space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium">
                                        ID del producto
                                    </label>
                                    <input
                                        disabled
                                        value={selectedProduct._id}
                                        className="w-full border px-3 py-2 rounded bg-gray-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">
                                        Código del producto
                                    </label>
                                    <input
                                        disabled
                                        value={selectedProduct.code}
                                        className="w-full border px-3 py-2 rounded bg-gray-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">
                                        Fecha de creación
                                    </label>
                                    <input
                                        disabled
                                        value={new Date(
                                            selectedProduct.createdAt
                                        ).toLocaleString()}
                                        className="w-full border px-3 py-2 rounded bg-gray-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">
                                        Última actualización
                                    </label>
                                    <input
                                        disabled
                                        value={new Date(
                                            selectedProduct.updatedAt
                                        ).toLocaleString()}
                                        className="w-full border px-3 py-2 rounded bg-gray-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">
                                        Nombre
                                    </label>
                                    <input
                                        name="name"
                                        defaultValue={selectedProduct.name}
                                        required
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">
                                        Precio
                                    </label>
                                    <input
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        defaultValue={selectedProduct.price}
                                        required
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">
                                        Descuento
                                    </label>
                                    <input
                                        name="discount"
                                        type="number"
                                        step="0.01"
                                        defaultValue={selectedProduct.discount}
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">
                                        Categoría
                                    </label>
                                    <input
                                        name="category"
                                        defaultValue={selectedProduct.category}
                                        required
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">
                                        Stock
                                    </label>
                                    <input
                                        name="stock"
                                        type="number"
                                        defaultValue={selectedProduct.stock}
                                        required
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">
                                        Link de imagen
                                    </label>
                                    <input
                                        name="thumbnail"
                                        defaultValue={
                                            selectedProduct.thumbnails
                                        }
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">
                                        Descripción
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        defaultValue={
                                            selectedProduct.description
                                        }
                                        required
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        name="status"
                                        type="checkbox"
                                        defaultChecked={selectedProduct.status}
                                        className="h-4 w-4"
                                    />
                                    <label>Activo</label>
                                </div>

                                <div className="text-right">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                    >
                                        Actualizar producto
                                    </button>
                                </div>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UpdateProduct;
