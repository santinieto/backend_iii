document.addEventListener("DOMContentLoaded", async () => {
    try {
        const url = "/api/auth/update-product";
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
        document.querySelector("#products-div").innerHTML = `
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
        // Creo el formulario con los valores por defecto que tiene el producto
        addUpdateProductForm(selectedProduct, productInfoDiv);
    });

    // Insertar en el DOM
    productsDiv.innerHTML = ""; // Limpiar contenido previo
    productsDiv.appendChild(select);
    productsDiv.appendChild(productInfoDiv);
};

const addUpdateProductForm = (productoInfo, productInfoDiv) => {
    productInfoDiv.innerHTML = ""; // Limpiar contenido previo

    const form = document.createElement("form");
    form.classList.add("card", "shadow", "border-0");

    // Título del formulario
    const title = document.createElement("div");
    title.classList.add("card-header", "bg-primary", "text-white");
    title.textContent = "Información del Producto";
    form.appendChild(title);

    const formBody = document.createElement("div");
    formBody.classList.add("card-body");

    // ID
    formBody.innerHTML += `
        <div class="mb-3">
            <label for="product-id" class="form-label">ID del producto</label>
            <input type="text" class="form-control" id="product-id" value="${
                productoInfo._id
            }" disabled>
        </div>
        <div class="mb-3">
            <label for="product-code" class="form-label">Código del producto</label>
            <input type="text" class="form-control" id="product-code" value="${
                productoInfo.code
            }" disabled>
        </div>
        <div class="mb-3">
            <label class="form-label">Fecha de creación</label>
            <input type="text" class="form-control" value="${new Date(
                productoInfo.createdAt
            ).toLocaleString()}" disabled>
        </div>
        <div class="mb-3">
            <label class="form-label">Última actualización</label>
            <input type="text" class="form-control" value="${new Date(
                productoInfo.updatedAt
            ).toLocaleString()}" disabled>
        </div>
        <div class="mb-3">
            <label for="product-name" class="form-label">Nombre del producto</label>
            <input type="text" class="form-control" id="product-name" value="${
                productoInfo.name
            }" required>
        </div>
        <div class="mb-3">
            <label for="product-price" class="form-label">Precio</label>
            <input type="number" class="form-control" id="product-price" value="${
                productoInfo.price
            }" step="0.01" required>
        </div>
        <div class="mb-3">
            <label for="product-discount" class="form-label">Descuento</label>
            <input type="number" class="form-control" id="product-discount" value="${
                productoInfo.discount
            }" step="0.01">
        </div>
        <div class="mb-3">
            <label for="product-category" class="form-label">Categoría</label>
            <input type="text" class="form-control" id="product-category" value="${
                productoInfo.category
            }" required>
        </div>
        <div class="mb-3">
            <label for="product-stock" class="form-label">Stock</label>
            <input type="number" class="form-control" id="product-stock" value="${
                productoInfo.stock
            }" required>
        </div>
        <div class="mb-3">
            <label for="product-thumbnail" class="form-label">Link de imagen</label>
            <input type="text" class="form-control" id="product-thumbnail" value="${
                productoInfo.thumbnails
            }">
        </div>
        <div class="mb-3">
            <label for="product-description" class="form-label">Descripción</label>
            <textarea class="form-control" id="product-description" rows="3" required>${
                productoInfo.description
            }</textarea>
        </div>
        <div class="form-check mb-3">
            <input type="checkbox" class="form-check-input" id="product-status" ${
                productoInfo.status ? "checked" : ""
            }>
            <label class="form-check-label" for="product-status">Activo</label>
        </div>
    `;

    // Footer con botón
    const formFooter = document.createElement("div");
    formFooter.classList.add("card-footer", "text-end");

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.classList.add("btn", "btn-primary");
    submitBtn.textContent = "Actualizar producto";
    formFooter.appendChild(submitBtn);

    // Añadir secciones al formulario
    form.appendChild(formBody);
    form.appendChild(formFooter);

    // Evento de envío
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const updatedProduct = {
            id: productoInfo._id,
            name: document.getElementById("product-name").value,
            price: parseFloat(document.getElementById("product-price").value),
            description: document.getElementById("product-description").value,
            code: productoInfo.code,
            category: document.getElementById("product-category").value,
            stock: parseInt(document.getElementById("product-stock").value),
            discount: parseFloat(
                document.getElementById("product-discount").value
            ),
            thumbnails: document.getElementById("product-thumbnail").value,
            status: document.getElementById("product-status").checked,
        };

        try {
            const response = await fetch(`/api/products/${productoInfo._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedProduct),
            });

            const result = await response.json();
            if (result.code === 200) {
                alert("Producto actualizado correctamente.");
                window.location.replace("/products");
            } else {
                alert("Error al actualizar el producto.");
                console.error(result);
            }
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            alert("Error de red al intentar actualizar el producto.");
        }
    });

    productInfoDiv.appendChild(form);
};
