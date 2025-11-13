const logOut = async () => {
    try {
        const url = "/api/auth/logout";
        const opts = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await fetch(url, opts);
        const result = await response.json();
        // console.log(result);

        // Gestiono el resultado
        if (result.status === "success") {
            // Elimino el token del localStorage
            localStorage.removeItem("token");

            // Redirijo al usuario a la pagina de inicio
            alert("Logout exitoso!");
            window.location.href = "/";
        } else {
            if (!localStorage.getItem("token")) {
                // Si no hay token, redirigir a la página de login
                alert(`No hay usuarios logeados`);
                window.location.replace("/login");
            } else {
                alert(result.message);
            }
        }
    } catch (error) {
        // console.log(error);
        alert("Error en el logout!");
    }
};
logOut();
