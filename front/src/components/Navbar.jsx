import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8080/api/auth/navbar",
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true, // si usás cookies para la sesión
                    }
                );
                setIsAuthenticated(response.data.status === "success");
            } catch (error) {
                console.error("Error al verificar autenticación:", error);
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    return (
        <nav className="bg-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="text-lg font-bold">
                        FastSells
                    </Link>
                    <div className="hidden md:flex space-x-4 items-center">
                        {isAuthenticated ? (
                            <AuthenticatedLinks />
                        ) : (
                            <GuestLinks />
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

const GuestLinks = () => (
    <>
        <Link to="/products" className="hover:underline">
            Productos
        </Link>
        <Link to="/login" className="hover:underline">
            Ingresar
        </Link>
        <Link to="/register" className="hover:underline">
            Registrarse
        </Link>
    </>
);

const AuthenticatedLinks = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <div
                className="relative"
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
            >
                <button className="hover:underline">Productos</button>
                <div
                    className={`absolute bg-white text-black mt-2 rounded shadow-lg z-10 ${
                        menuOpen ? "block" : "hidden"
                    }`}
                >
                    <Link
                        to="/products"
                        className="block px-4 py-2 hover:bg-gray-200"
                    >
                        Ver productos
                    </Link>
                    <Link
                        to="/add-product"
                        className="block px-4 py-2 hover:bg-gray-200"
                    >
                        Agregar producto
                    </Link>
                    <Link
                        to="/update-product"
                        className="block px-4 py-2 hover:bg-gray-200"
                    >
                        Actualizar producto
                    </Link>
                    <Link
                        to="/delete-product"
                        className="block px-4 py-2 hover:bg-gray-200"
                    >
                        Eliminar producto
                    </Link>
                </div>
            </div>

            <Link to="/profile" className="hover:underline">
                Perfil
            </Link>
            <Link to="/control-panel" className="hover:underline">
                Panel de control
            </Link>
            <Link to="/logout" className="hover:underline">
                Salir
            </Link>
        </>
    );
};

export default Navbar;
