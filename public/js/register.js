document
    .querySelector("#register-form")
    .addEventListener("submit", async (e) => {
        e.preventDefault();

        // Validar los campos del formulario
        const formData = {
            first_name: document.querySelector("#first-name").value,
            last_name: document.querySelector("#last-name").value,
            city: document.querySelector("#city").value,
            email: document.querySelector("#email").value,
            password: document.querySelector("#password").value,
        };
        // console.log(formData);

        // Hacer la llamada a la API
        const response = await fetch("/api/auth/register", {
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
            alert("Registro exitoso!");
            window.location.href = "/login";
        } else {
            alert(result.message);
        }
    });
