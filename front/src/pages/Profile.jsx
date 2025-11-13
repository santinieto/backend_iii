import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8080/api/auth/profile",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            // Agrega aquí el token si es necesario
                        },
                        withCredentials: true, // si estás usando cookies
                    }
                );

                const result = response.data;

                if (result.status === "success") {
                    setUser(result.response);
                } else {
                    if (result.code === 401) {
                        alert("No hay usuarios logeados");
                        window.location.replace("/login");
                    } else {
                        setError(result.message || "Error desconocido");
                    }
                }
            } catch (err) {
                setError("No se pudo obtener el perfil");
                window.location.replace("/login");
            }
        };

        fetchProfile();
    }, []);

    if (error) {
        return <div className="text-red-500 text-center mt-10">{error}</div>;
    }

    if (!user) {
        return <div className="text-center mt-10">Cargando perfil...</div>;
    }

    return (
        <div className="flex justify-center mt-10">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6 text-center">
                <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-28 h-28 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">
                    {user.first_name} {user.last_name}
                </h3>
                <p className="text-gray-500">{user.email}</p>

                <ul className="text-left mt-4 space-y-2">
                    <li>
                        <strong>Ciudad:</strong> <span>{user.city}</span>
                    </li>
                    <li>
                        <strong>Rol:</strong> <span>{user.role}</span>
                    </li>
                </ul>

                <div className="mt-6">
                    <a
                        href="/logout"
                        className="inline-block px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
                    >
                        Cerrar sesión
                    </a>
                </div>
            </div>
        </div>
    );
}
