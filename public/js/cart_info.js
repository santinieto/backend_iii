document.addEventListener("DOMContentLoaded", async () => {
    try {
        const $confirmCart = document.getElementById("confirm-cart");

        $confirmCart.addEventListener("click", async (e) => {
            e.preventDefault();

            const cartId = $confirmCart.getAttribute("data-cart-id");
            console.log(cartId);

            try {
                const response = await fetch(`/api/orders/${cartId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(
                        errorText || "Error al confirmar la compra"
                    );
                }

                const result = await response.json();
                const orderId = result.response._id;

                // Redirigir a la vista del recibo
                alert("Se genero correctamente la orden");
                window.location.replace(`/orders/${orderId}`);
            } catch (err) {
                console.error("Error al confirmar compra:", err);
                alert("Hubo un error al confirmar la compra");
            }
        });
    } catch (error) {
        console.error("Error al agregar el event listener:", error);
    }
});
