import { useState } from "react";
import axios from "axios";

const AddProductForm = () => {
    const [form, setForm] = useState({
        name: "",
        price: "",
        discount: "",
        category: "",
        thumbnails: "",
        stock: "",
        code: "",
        description: "",
        status: true,
    });

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                price: parseFloat(form.price),
                discount: parseFloat(form.discount) || 0,
                stock: parseInt(form.stock),
            };

            const res = await axios.post(
                "http://localhost:8080/api/products/",
                payload,
                { withCredentials: true }
            );
            console.log(res);

            if (res.status === 201 || res.data.code === 201) {
                alert("Producto agregado correctamente");
                window.location.replace("/products");
            } else {
                alert(
                    "Error al agregar el producto: " +
                        (res.data.error || "Desconocido")
                );
            }
        } catch (error) {
            console.error(error);
            alert("Error al agregar el producto: " + error.message);
        }
    };

    return (
        <div className="container mx-auto mt-10 px-4">
            <div className="bg-white shadow rounded p-6">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Lista de productos
                </h1>
                <h2 className="text-xl mb-4">Agregar Producto</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium"
                            >
                                Nombre del Producto
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={form.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="price"
                                className="block text-sm font-medium"
                            >
                                Precio
                            </label>
                            <input
                                id="price"
                                type="number"
                                required
                                value={form.price}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="discount"
                                className="block text-sm font-medium"
                            >
                                Descuento (%)
                            </label>
                            <input
                                id="discount"
                                type="number"
                                step="0.1"
                                value={form.discount}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="category"
                                className="block text-sm font-medium"
                            >
                                Categoría
                            </label>
                            <input
                                id="category"
                                type="text"
                                required
                                value={form.category}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label
                                htmlFor="thumbnails"
                                className="block text-sm font-medium"
                            >
                                Imagen
                            </label>
                            <input
                                id="thumbnails"
                                type="text"
                                required
                                value={form.thumbnails}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="stock"
                                className="block text-sm font-medium"
                            >
                                Stock
                            </label>
                            <input
                                id="stock"
                                type="number"
                                required
                                value={form.stock}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="code"
                                className="block text-sm font-medium"
                            >
                                Código del Producto
                            </label>
                            <input
                                id="code"
                                type="text"
                                required
                                value={form.code}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded p-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium"
                        >
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            rows="3"
                            value={form.description}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            id="status"
                            type="checkbox"
                            checked={form.status}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label htmlFor="status" className="text-sm">
                            Disponible
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
                    >
                        Agregar Producto
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;
