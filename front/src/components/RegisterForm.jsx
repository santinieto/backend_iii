import { useState } from "react";
import axios from "axios";

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        city: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/register",
                formData,
                {
                    withCredentials: true,
                }
            );
            console.log("Registro exitoso:", response.data);
            alert("Registro exitoso! Por favor, inicia sesión.");
            window.location.href = "/login";
        } catch (error) {
            console.error(
                "Error en el registro:",
                error.response?.data || error.message
            );
            alert("Error en el registro. Por favor, verifica tus datos.");
        }
    };

    return (
        <div className="container mx-auto mt-10 max-w-md bg-white p-8 shadow-md rounded">
            <h1 className="text-2xl font-bold mb-6 text-center">
                Register Form
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700"
                    >
                        First Name
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                    >
                        City
                    </label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                </div>

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
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
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
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
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
