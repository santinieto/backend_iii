document
    .querySelector("#verification-form")
    .addEventListener("submit", async (e) => {
        e.preventDefault();

        // Validar los campos del formulario
        const formData = {
            email: document.querySelector("#verification-email").value,
            verificationCode:
                document.querySelector("#verification-code").value,
        };
        // console.log(formData);

        // Hacer la llamada a la API
        const response = await fetch("/api/auth/verify-account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        const result = await response.json();
        // console.log(result);

        // Gestiono el resultado
        if (result.status === "success") {
            // Guardar el token en el localStorage
            // localStorage.setItem("token", result.response);

            // Redirigir al usuario a la pagina de inicio
            alert("Verificacion exitosa!");
            window.location.href = "/login";
        } else {
            alert(result.message);
        }
    });
