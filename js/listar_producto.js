import solicitud from "./ajax.js";

const $template = document.getElementById("products").content;
const fragmento = document.createDocumentFragment();
const tableBody = document.querySelector("#tbody");

const normalizeProductData = (product) => {
    return {
        id: product.id,
        name: product.nombre || product.Nombre || "",
        type: product.tipo || product.Tipo || "",
        quantity: product.cantidad || product.Cantidad || "",
        brand: product.marca || product.Marca || "",
        price: product.precio || product.Precio || "",
        expiration_date: product.fech_venc || product.Fech_venc || "",
        supplier_id: product.proveedor || product.Proveedor || "",
        description: product.descripcion || product.Descripcion || "",
    };
};

const listar = async () => {
    try {
        // Obtener datos de productos y proveedores
        const [data, proveedores] = await Promise.all([
            solicitud('producto'),
            solicitud('proveedor')
        ]);

        if (data.error || proveedores.error) {
            throw new Error(data.error || proveedores.error);
        }

        if (!Array.isArray(data) || !Array.isArray(proveedores)) {
            throw new Error('Formato de datos inesperado');
        }

        // Mapear ID de proveedores a sus nombres
        const proveedorMap = proveedores.reduce((map, proveedor) => {
            map[proveedor.id] = proveedor.nombre;
            return map;
        }, {});

        // Normalizar y procesar los datos de productos
        const products = data.map(normalizeProductData);

        products.forEach((element) => {
            console.log(element);
            const clone = document.importNode($template, true);
            clone.querySelector(".id").textContent = element.id;
            clone.querySelector(".nombre").textContent = element.name;
            clone.querySelector(".tipo").textContent = element.type;
            clone.querySelector(".cantidad").textContent = element.quantity;
            clone.querySelector(".marca").textContent = element.brand;
            clone.querySelector(".precio").textContent = element.price;
            clone.querySelector(".fech_venc").textContent = element.expiration_date;
            clone.querySelector(".descripcion").textContent = element.description;
            
            // Reemplazar el ID del proveedor con el nombre
            clone.querySelector(".proveedor").textContent = proveedorMap[element.supplier_id] || "Desconocido";

            clone.querySelector(".edit").setAttribute("data-id", element.id);
            clone.querySelector(".delete").setAttribute("data-id", element.id);

            fragmento.appendChild(clone);
        });

        tableBody.appendChild(fragmento);
    } catch (error) {
        console.error('Error al listar los productos:', error.message || error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    listar();
});