document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("cartSelect");
    const carts = document.querySelectorAll(".cart-container");

    function showSelectedCart(cartId) {
        carts.forEach((cart) => {
            cart.style.display =
                cart.id === `cart-${cartId}` ? "block" : "none";
        });
    }

    // Mostrar el primer carrito por defecto
    if (select && select.value) {
        showSelectedCart(select.value);
    }

    // Escuchar cambios
    select?.addEventListener("change", (e) => {
        showSelectedCart(e.target.value);
    });
});
