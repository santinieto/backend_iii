const addProduct = async (product) => {
    const url = "/api/products/";
    const opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    };
    const response = await fetch(url, opts);
    const result = await response.json();
    // console.log(result);

    if (result.code === 201) {
        // Si el producto se agrega correctamente, muestro un mensaje de exito
        alert("Producto agregado correctamente");
        // Redirijo a la pagina de productos
        window.location.replace("/products");
    } else {
        // Si no se agrega, muestro el error en la consola
        console.log(result.error);
        alert("Error al agregar el producto: " + result.error);
    }
};

const main = () => {
    $productForm = document.getElementById("product-form");

    // Obtengo la informacion del producto que se va a agregar
    $productForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const product = {
            name: document.getElementById("name").value,
            price: parseFloat(document.getElementById("price").value),
            discount:
                parseFloat(document.getElementById("discount").value) || 0,
            category: document.getElementById("category").value,
            description: document.getElementById("description").value,
            thumbnails: document.getElementById("thumbnails").value || "",
            stock: parseInt(document.getElementById("stock").value),
            code: document.getElementById("code").value,
            status: document.getElementById("status").checked,
        };
        addProduct(product);
    });
};
main();
