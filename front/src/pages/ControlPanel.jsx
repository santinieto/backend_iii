import { useEffect, useState } from "react";
import axios from "axios";

const ControlPanel = () => {
    const [user, setUser] = useState(null);
    const [errorCode, setErrorCode] = useState(null);

    useEffect(() => {
        const fetchPanelData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8080/api/auth/control-panel",
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const result = response.data;

                if (result.status === "success") {
                    setUser(result.response);
                } else {
                    setErrorCode(result.code);
                }
            } catch (error) {
                console.error("Error al cargar el panel de control:", error);
                setErrorCode("network");
            }
        };

        fetchPanelData();
    }, []);

    if (errorCode === 401) {
        alert("No hay usuarios logeados");
        window.location.replace("/login");
        return null;
    }

    return (
        <div className="container mx-auto mt-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Panel de control</h1>
            <div id="control-panel-div" className="mt-6">
                {user ? (
                    <>
                        <h2 className="text-2xl font-semibold mb-3">
                            Bienvenido, {user.name || "usuario"}!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Seleccioná una opción del menú para comenzar.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h5 className="text-lg font-bold mb-2">
                                    Resumen
                                </h5>
                                <p className="text-sm text-gray-700 mb-4">
                                    Estadísticas generales, actividad reciente y
                                    más.
                                </p>
                                <a
                                    href="#"
                                    className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200"
                                >
                                    Ver más
                                </a>
                            </div>
                            {/* Agrega más tarjetas aquí si querés */}
                        </div>
                    </>
                ) : errorCode === 403 ? (
                    <div className="bg-red-100 text-red-700 p-4 rounded">
                        El usuario no tiene permisos para acceder al panel de
                        control.
                    </div>
                ) : errorCode === "network" ? (
                    <div className="bg-yellow-100 text-yellow-800 p-4 rounded">
                        Hubo un error al cargar el panel. Intentalo de nuevo más
                        tarde.
                    </div>
                ) : (
                    <div className="text-gray-500">Cargando...</div>
                )}
            </div>
        </div>
    );
};

export default ControlPanel;
