import React from "react";

export default function ProductInfoCard({ product }) {
    if (!product) return null;

    return (
        <div className="container mx-auto mt-10 px-4">
            <div className="bg-white shadow-md rounded p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">
                    Información del producto{" "}
                    <span className="text-blue-600">{product._id}</span>
                </h1>
            </div>

            <div className="mt-6 flex justify-center bg-white border rounded shadow-md p-6 flex-wrap gap-6">
                <div className="w-full md:w-1/2 lg:w-1/3">
                    <div className="bg-gray-50 shadow-lg rounded overflow-hidden">
                        <img
                            src={
                                product.thumbnails
                                    ? `/img/${product.thumbnails}`
                                    : "/img/image-not-found.jpg"
                            }
                            alt={`Imagen de ${product.name}`}
                            className="w-full h-80 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">
                                {product.name}{" "}
                                <span className="text-gray-500">
                                    ({product._id})
                                </span>
                            </h2>
                            <p>
                                <strong>Categoría:</strong> {product.category}
                            </p>
                            <p>
                                <strong>Descripción:</strong>{" "}
                                {product.description}
                            </p>
                            <p>
                                <strong>Precio:</strong> ${product.price}
                            </p>
                            <p>
                                <strong>Descuento:</strong> {product.discount}%
                            </p>
                            <p>
                                <strong>Stock:</strong> {product.stock} unidades
                            </p>
                            <p>
                                <strong>Código:</strong> {product.code}
                            </p>
                            <p className="mt-2">
                                <strong>Estado:</strong>{" "}
                                <span
                                    className={`inline-block px-2 py-1 text-sm rounded ${
                                        product.status
                                            ? "bg-green-500 text-white"
                                            : "bg-red-500 text-white"
                                    }`}
                                >
                                    {product.status ? "Disponible" : "Agotado"}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-center">
                <a
                    href="/products"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                    Volver
                </a>
            </div>
        </div>
    );
}
