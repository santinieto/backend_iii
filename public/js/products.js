const main = () => {
    const $goToProductButtons = document.querySelectorAll(
        "button[id^='go-to-product-']"
    );
    const $addToCartButtons = document.querySelectorAll(
        "button[id^='add-to-cart-']"
    );
    const $cartSelect = document.getElementById("cart-select");

    $goToProductButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const productId = button.id.replace("go-to-product-", "");
            window.location.replace(`/products/${productId}`);
        });
    });

    $addToCartButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const productId = button.id.replace("add-to-cart-", "");
            const cartId = $cartSelect.value;

            if (!cartId) {
                alert(
                    "Por favor, seleccione un carrito antes de agregar productos."
                );
                return;
            }

            try {
                const response = await fetch(`/api/carts/add-product`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({
                        cart_id: cartId,
                        product_id: productId,
                        quantity: 1,
                    }),
                });
                data = await response.json();
                // console.log(data);

                if (data.code === 200) {
                    alert("Producto agregado al carrito correctamente.");
                    window.location.replace(`/carts/${cartId}`);
                } else {
                    const error = new Error(data.message);
                    error.status = data.status;
                    throw error;
                }
            } catch (error) {
                console.error("Error al agregar producto al carrito:", error);
                alert(
                    `Hubo un error al intentar agregar el producto al carrito. ${error}`
                );
            }
        });
    });
};
main();
