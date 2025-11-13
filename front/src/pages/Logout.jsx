import { useEffect } from "react";
import axios from "axios";

const Logout = () => {
    useEffect(() => {
        const logOut = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8080/api/auth/logout",
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log("Logout response:", response);

                const result = response.data;

                if (result.status === "success") {
                    localStorage.removeItem("token");
                    alert("Logout exitoso!");
                    window.location.href = "/";
                } else {
                    if (!localStorage.getItem("token")) {
                        alert("No hay usuarios logeados");
                        window.location.replace("/login");
                    } else {
                        alert(result.message || "Error desconocido");
                    }
                }
            } catch (error) {
                console.error("Error en el logout:", error);
                alert("Error en el logout!");
            }
        };

        logOut();
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-lg text-gray-700">Cerrando sesión...</p>
        </div>
    );
};

export default Logout;
