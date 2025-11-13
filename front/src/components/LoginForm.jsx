import { useState } from "react";
import axios from "axios";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                {
                    email,
                    password,
                },
                { withCredentials: true }
            );

            console.log("Login exitoso:", response.data);
            alert("Login exitoso! Bienvenido.");
            window.location.href = "/products";
        } catch (error) {
            console.error(
                "Error de autenticación:",
                error.response?.data || error.message
            );
            alert(
                "Error de autenticación. Por favor, verifica tus credenciales."
            );
        }
    };

    return (
        <div className="container mx-auto mt-10 max-w-md bg-white p-8 shadow-md rounded">
            <h1 className="text-2xl font-bold mb-6 text-center">Login Form</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-300"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-300"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
