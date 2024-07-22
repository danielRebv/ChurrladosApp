import { fetchProducts, addOrUpdateProduct, updateProduct, deleteProduct } from './api.js';

const inventoryList = document.getElementById('inventory-list');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const editQuantityInput = document.getElementById('edit-quantity');
const lowStockModal = document.getElementById('low-stock-modal');
const lowStockList = document.getElementById('low-stock-list');
const exportPdfButton = document.getElementById('export-pdf');
const exportExcelButton = document.getElementById('export-excel');
const lowStockThreshold = 10; // Umbral para cantidad baja
const itemsPerPage = 5;

let currentPage = 1;
let inventory = [];
let providers = [];
let editIndex = null;

export function setProviders(providerList) {
    providers = providerList;
}

export async function loadInventory(page = 1) {
    try {
        currentPage = page;
        const data = await fetchProducts(page, itemsPerPage);
        inventory = data.products;
        renderInventory();
        updatePagination(data.totalPages, page);
        checkLowStock(); // Verificar productos con cantidad baja
    } catch (error) {
        console.error("Error loading inventory:", error);
    }
}

async function loadAllInventory() {
    try {
        let allInventory = [];
        let page = 1;
        let totalPages = 1;
        
        do {
            const data = await fetchProducts(page, itemsPerPage);
            allInventory = allInventory.concat(data.products);
            totalPages = data.totalPages;
            page++;
        } while (page <= totalPages);

        return allInventory;
    } catch (error) {
        console.error("Error loading all inventory:", error);
        return [];
    }
}

function renderInventory() {
    inventoryList.innerHTML = '';
    inventory.forEach((product, index) => {
        const productItem = document.createElement('li');
        productItem.className = "list-group-item d-flex justify-content-between align-items-center";
        
        if (product.quantity < lowStockThreshold) {
            productItem.classList.add('low-stock'); // Resaltar productos con cantidad baja
            const alertIcon = document.createElement('i');
            alertIcon.className = 'fas fa-exclamation-triangle text-danger mr-2';
            productItem.prepend(alertIcon);
        }

        const provider = providers.find(provider => provider.id === product.providerId);
        const providerInfo = provider ? `${provider.service} (${provider.city})` : 'Proveedor desconocido';
        productItem.innerHTML += `${product.name} - Cantidad: ${product.quantity} - Proveedor: ${providerInfo}`;

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('btn', 'btn-primary', 'ml-2');
        editButton.addEventListener('click', () => openEditModal(index));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('btn', 'btn-danger', 'ml-2');
        deleteButton.addEventListener('click', () => handleDeleteProduct(index));

        const buttonContainer = document.createElement('div');
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
        productItem.appendChild(buttonContainer);

        inventoryList.appendChild(productItem);
    });
}

function updatePagination(totalPages, currentPage) {
    pageInfo.textContent = `Página ${currentPage}`;
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
}

prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        loadInventory(currentPage - 1);
    }
});

nextPageButton.addEventListener('click', () => {
    loadInventory(currentPage + 1);
});

export async function handleAddOrUpdateProduct(product) {
    try {
        if (inventory.some(p => p.id === product.id)) {
            await updateProduct(product.id, product);
        } else {
            await addOrUpdateProduct(product);
        }
        loadInventory(currentPage);
    } catch (error) {
        console.error("Error adding or updating product:", error);
    }
}

async function handleDeleteProduct(index) {
    try {
        const productId = inventory[index].id;
        await deleteProduct(productId);
        loadInventory(currentPage);
    } catch (error) {
        console.error("Error deleting product:", error);
    }
}

function openEditModal(index) {
    const product = inventory[index];
    editQuantityInput.value = product.quantity;
    editIndex = index;
    $('#edit-modal').modal('show'); // Mostrar el modal con jQuery
}

if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newQuantity = parseInt(editQuantityInput.value.trim());
        if (!isNaN(newQuantity)) {
            const product = inventory[editIndex];
            product.quantity = newQuantity;
            try {
                const response = await fetch(`http://localhost:5000/api/products/${product.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(product)
                });
                inventory[editIndex] = await response.json();
                renderInventory();
                $('#edit-modal').modal('hide'); // Ocultar el modal con jQuery
                checkLowStock(); // Verificar productos con cantidad baja
            } catch (err) {
                console.error(err);
            }
        }
    });
}

function checkLowStock() {
    const lowStockProducts = inventory.filter(product => product.quantity < lowStockThreshold);
    if (lowStockProducts.length > 0) {
        alertLowStock(lowStockProducts);
    }
}

function alertLowStock(products) {
    lowStockList.innerHTML = '';
    products.forEach(product => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = `${product.name} - Cantidad: ${product.quantity}`;
        lowStockList.appendChild(listItem);
    });
    $('#low-stock-modal').modal('show'); // Mostrar el modal con jQuery
}

// Convertir la imagen a base64
function convertImageToBase64(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        const reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

document.addEventListener('DOMContentLoaded', () => {
    if (exportPdfButton) {
        exportPdfButton.addEventListener('click', async () => {
            convertImageToBase64('logo.webp', async (logoBase64) => {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                const allInventory = await loadAllInventory();
        
                // Agregar el logo al PDF
                const logoWidth = 50; // Ancho del logo en mm
                const logoHeight = 50; // Alto del logo en mm
                const logoX = 75; // Posición X del logo en mm
                const logoY = 10; // Posición Y del logo en mm
                doc.addImage(logoBase64, 'WEBP', logoX, logoY, logoWidth, logoHeight);
        
                // Agregar el título del documento debajo del logo
                doc.setFontSize(18);
                doc.text('Inventario de Productos - Churrolados', 14, logoY + logoHeight + 10);
                
                // Configuración de la tabla
                const columns = [
                    { header: 'ID del Producto', dataKey: 'id' },
                    { header: 'Nombre del Producto', dataKey: 'name' },
                    { header: 'Cantidad', dataKey: 'quantity' },
                    { header: 'Proveedor', dataKey: 'provider' }
                ];
        
                const rows = allInventory.map(product => {
                    const provider = providers.find(provider => provider.id === product.providerId);
                    const providerInfo = provider ? `${provider.service} (${provider.city})` : 'Proveedor desconocido';
                    return {
                        id: product.id,
                        name: product.name,
                        quantity: product.quantity,
                        provider: providerInfo
                    };
                });
        
                // Generar la tabla
                doc.autoTable({
                    startY: logoY + logoHeight + 20, // Asegurar que la tabla empieza debajo del logo y del título
                    head: [columns.map(col => col.header)],
                    body: rows.map(row => columns.map(col => row[col.dataKey])),
                    theme: 'grid',
                    styles: {
                        fontSize: 10,
                        cellPadding: 3,
                        halign: 'center'
                    },
                    headStyles: {
                        fillColor: [41, 128, 185],
                        textColor: [255, 255, 255],
                        fontSize: 12,
                        halign: 'center'
                    },
                    margin: { top: 20, bottom: 20, left: 10, right: 10 }
                });
        
                // Guardar el PDF
                doc.save('inventario.pdf');
            });
        });
    }

    if (exportExcelButton) {
        exportExcelButton.addEventListener('click', async () => {
            const allInventory = await loadAllInventory();
            const worksheet = XLSX.utils.json_to_sheet(allInventory.map(product => ({
                "ID del Producto": product.id,
                "Nombre del Producto": product.name,
                "Cantidad": product.quantity,
                "Proveedor": providers.find(provider => provider.id === product.providerId)?.service || 'Proveedor desconocido'
            })));
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
            XLSX.writeFile(workbook, 'inventario.xlsx');
        });
    }
});
