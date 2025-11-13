const showMenu = async () => {
    try {
        const url = "/api/auth/control-panel";
        const opts = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await fetch(url, opts);
        const result = await response.json();
        // console.log(result);

        const panelDiv = document.querySelector("#control-panel-div");

        // Gestiono el resultado
        if (result.status === "success") {
            // Obtengo el usuario
            const user = result.response;
            // console.log(user);

            // Contenido del panel si el usuario tiene permisos
            panelDiv.innerHTML = `
                <h2 class="mb-4">Bienvenido, ${user.name || "usuario"}!</h2>
                <p>Seleccioná una opción del menú para comenzar.</p>

                <div class="row mt-5">
                    <div class="col-md-4">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">Resumen</h5>
                                <p class="card-text">Estadísticas generales, actividad reciente y más.</p>
                                <a href="#" class="btn btn-outline-primary btn-sm">Ver más</a>
                            </div>
                        </div>
                    </div>
                    <!-- Podés agregar más tarjetas acá si querés -->
                </div>
            `;
        } else {
            if (result.code === 401) {
                // Si no hay token, redirigir a la página de login
                alert(`No hay usuarios logeados`);
                window.location.replace("/login");
            } else if (result.code === 403) {
                // Mensaje de error si no tiene permisos
                panelDiv.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        El usuario no tiene permisos para acceder al panel de control.
                    </div>
                `;
            } else {
                // Mensaje de error genérico
                panelDiv.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        Hubo un error al cargar el panel. Intentalo de nuevo más tarde.
                    </div>
                `;
            }
        }
    } catch (error) {
        // Si no hay token, redirigir a la página de login
        document.querySelector("#control-panel-div").innerHTML = `
                <div class="alert alert-warning" role="alert">
                    Hubo un error al cargar el panel. Intentalo de nuevo más tarde.
                </div>
            `;
        console.error("Error al cargar el panel de control:", error);
    }
};
showMenu();
