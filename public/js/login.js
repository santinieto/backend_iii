document.querySelector("#login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar los campos del formulario
    const formData = {
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
    };
    // console.log(formData);

    // Hacer la llamada a la API
    const response = await fetch("/api/auth/login", {
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
        alert("Logeo exitoso!");
        window.location.href = "/profile";
    } else {
        alert(result.message);
        // Se que no es lo idea hacer esto pero no tuve tiempo de implementar algo mejor
        if (result.message === "La cuenta no está verificada") {
            window.location.href = "/verify-account";
        }
    }
});
