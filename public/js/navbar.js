document.addEventListener("DOMContentLoaded", async () => {
    try {
        const url = "/api/auth/navbar";
        const opts = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await fetch(url, opts);
        const result = await response.json();

        if (result.status === "success") {
            // Usuario autenticado
            renderNavbar(true);
        } else {
            // Usuario no autenticado
            renderNavbar(false);
        }
    } catch (error) {
        renderNavbar(false); // Usuario no autenticado
    }

    function renderNavbar(isAuthenticated) {
        const navbarContainer = document.getElementById("navbar-container");

        const common = `
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="/">Mi Sitio</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
                        aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarContent">
                        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                            ${
                                isAuthenticated
                                    ? authenticatedLinks()
                                    : guestLinks()
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        `;

        navbarContainer.innerHTML = common;
    }
    function guestLinks() {
        return `
            <li class="nav-item">
                <a class="nav-link" href="/products">Productos</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/login">Ingresar</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/register">Registrarse</a>
            </li>
        `;
    }

    function authenticatedLinks() {
        return `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="productosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Productos
                </a>
                <ul class="dropdown-menu" aria-labelledby="productosDropdown">
                    <li><a class="dropdown-item" href="/products">Ver productos</a></li>
                    <li><a class="dropdown-item" href="/add-product">Agregar producto</a></li>
                    <li><a class="dropdown-item" href="/update-product">Actualizar producto</a></li>
                    <li><a class="dropdown-item" href="/delete-product">Eliminar producto</a></li>
                </ul>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/carts">Carritos</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/profile">Perfil</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/control-panel">Panel de control</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/logout">Salir</a>
            </li>
        `;
    }
});
