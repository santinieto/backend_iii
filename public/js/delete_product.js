document.addEventListener("DOMContentLoaded", async () => {
    try {
        const url = "/api/auth/delete-product";
        const opts = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await fetch(url, opts);
        const result = await response.json();

        const productsDiv = document.querySelector("#products-div");

        if (result.status === "success") {
            const productList = await getProductList();
            if (!productList) return;
            // console.log(productList);

            showProductList(productList, productsDiv);
        } else {
            if (result.code === 401) {
                // Si no hay token, redirigir a la página de login
                alert(`No hay usuarios logeados`);
                window.location.replace("/login");
            } else if (result.code === 403) {
                // Mensaje de error si no tiene permisos
                productsDiv.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        El usuario no tiene permisos para acceder al panel de control.
                    </div>
                `;
            } else {
                // Mensaje de error genérico
                productsDiv.innerHTML = `
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
});

const getProductList = async () => {
    const url = "/api/products";
    const opts = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    const response = await fetch(url, opts);
    const result = await response.json();

    if (result.code === 200) {
        return result.response; // Devuelve la lista de productos
    } else {
        console.error("Error al obtener la lista de productos:", result);
        return null;
    }
};

const showProductList = (productList, productsDiv) => {
    // Crear el HTML para la lista desplegable
    const select = document.createElement("select");
    select.classList.add("form-select", "mb-3");
    select.id = "product-selector";

    // Agregar una opción por defecto
    const defaultOption = document.createElement("option");
    defaultOption.text = "Selecciona un producto";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    // Llenar la lista con los productos
    productList.forEach((product, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.text = product.name;
        select.appendChild(option);
    });

    // Div donde se mostrará la info del producto
    const productInfoDiv = document.createElement("div");
    productInfoDiv.id = "product-info";

    // Escuchar el cambio de selección
    select.addEventListener("change", (e) => {
        const selectedProduct = productList[e.target.value];
        productInfoDiv.innerHTML = `
        <div class="card mt-3 shadow-sm">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0">Información del Producto</h5>
            </div>
            <div class="card-body">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><strong>ID:</strong> ${
                        selectedProduct._id
                    }</li>
                    <li class="list-group-item"><strong>Código:</strong> ${
                        selectedProduct.code
                    }</li>
                    <li class="list-group-item"><strong>Nombre:</strong> ${
                        selectedProduct.name
                    }</li>
                    <li class="list-group-item"><strong>Precio:</strong> $${
                        selectedProduct.price
                    }</li>
                    <li class="list-group-item"><strong>Descuento:</strong> ${
                        selectedProduct.discount
                    }%</li>
                    <li class="list-group-item"><strong>Categoría:</strong> ${
                        selectedProduct.category
                    }</li>
                    <li class="list-group-item"><strong>Descripción:</strong> ${
                        selectedProduct.description || "Sin descripción"
                    }</li>
                    <li class="list-group-item"><strong>Stock:</strong> ${
                        selectedProduct.stock
                    }</li>
                    <li class="list-group-item"><strong>Estado:</strong> ${
                        selectedProduct.status
                    }</li>
                    <li class="list-group-item"><strong>Creado el:</strong> ${new Date(
                        selectedProduct.createdAt
                    ).toLocaleString()}</li>
                    <li class="list-group-item"><strong>Actualizado el:</strong> ${new Date(
                        selectedProduct.updatedAt
                    ).toLocaleString()}</li>
                    <li class="list-group-item"><strong>Thumbnails:</strong> ${
                        selectedProduct.thumbnails
                    }</li>
                </ul>
            </div>
        </div>
    `;
        addDeleteButton(selectedProduct._id, productInfoDiv); // Agregar botón de eliminar
    });

    // Insertar en el DOM
    productsDiv.innerHTML = ""; // Limpiar contenido previo
    productsDiv.appendChild(select);
    productsDiv.appendChild(productInfoDiv);
};

const addDeleteButton = (productID, productInfoDiv) => {
    const buttonWrapper = document.createElement("div");
    buttonWrapper.classList.add("d-flex", "justify-content-end", "mt-3");

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Eliminar Producto";

    deleteButton.addEventListener("click", async () => {
        const url = `/api/products/${productID}`;
        const opts = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await fetch(url, opts);
        const result = await response.json();

        if (result.code === 200) {
            alert("Producto eliminado con éxito.");
            window.location.replace("/products");
        } else {
            alert("Error al eliminar el producto.");
        }
    });

    buttonWrapper.appendChild(deleteButton);
    productInfoDiv.appendChild(buttonWrapper);
};
