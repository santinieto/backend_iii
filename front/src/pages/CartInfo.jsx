import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CartInfo = () => {
    const { cartId } = useParams();
    const [cart, setCart] = useState(null);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/carts/${cartId}`,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                const cart = response.data;
                setCart(cart);
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };
        fetchCart();
    }, []);

    return (
        <div className="container mx-auto mt-10 px-4">
            {cart ? (
                <>
                    <div className="bg-white shadow-md rounded p-6">
                        <h1 className="text-2xl font-bold text-center mb-6">
                            Información del carrito {cart._id}
                        </h1>
                    </div>

                    <div className="mt-6 border p-4 rounded bg-white overflow-y-auto flex flex-wrap gap-4">
                        <div className="w-full md:w-1/3 mx-auto mb-4">
                            <ul className="list-disc pl-5">
                                {cart.products.map((product, index) => (
                                    <li key={index}>
                                        Producto {product._id} - Cantidad{" "}
                                        {product.quantity}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-6 border p-4 rounded bg-white flex justify-center">
                        <a
                            href="/products"
                            className="btn btn-primary mx-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Volver
                        </a>
                    </div>
                </>
            ) : (
                <div className="flex justify-center items-center h-screen">
                    <p className="text-lg text-gray-700">Cargando carrito...</p>
                </div>
            )}
        </div>
    );
};

export default CartInfo;
