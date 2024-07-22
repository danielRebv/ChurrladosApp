import { loadProviders, getProviders } from './providers.js';
import { loadInventory, setProviders, handleAddOrUpdateProduct } from './inventory.js';

document.addEventListener('DOMContentLoaded', () => {
    async function initialize() {
        await loadProviders();
        const providerList = getProviders();
        if (Array.isArray(providerList) && providerList.length > 0) {
            setProviders(providerList);
            await loadInventory();
        } else {
            console.error("No providers available to set.");
        }

        const productForm = document.getElementById('product-form');
        if (productForm) {
            productForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const providerId = parseInt(document.getElementById('provider-id').value.trim());
                const productId = parseInt(document.getElementById('product-id').value.trim());
                const productName = document.getElementById('product-name').value.trim();
                const productQuantity = parseInt(document.getElementById('product-quantity').value.trim());

                if (!isNaN(providerId) && !isNaN(productId) && productName && !isNaN(productQuantity)) {
                    await handleAddOrUpdateProduct({ id: productId, providerId, name: productName, quantity: productQuantity });
                    productForm.reset();
                } else {
                    alert('Por favor, complete todos los campos con valores válidos.');
                }
            });
        } else {
            console.error("Element with ID 'product-form' not found.");
        }

        // Lógica para el escaneo de QR
        const scanQRButton = document.getElementById('scan-qr');
        let qrReader;
        let scannedProduct = null;

        if (scanQRButton) {
            scanQRButton.addEventListener('click', () => {
                qrReader = new Html5Qrcode("qr-reader");
                qrReader.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: 250
                    },
                    async (decodedText) => {
                        try {
                            const productData = parseQRData(decodedText);
                            if (productData) {
                                scannedProduct = productData;
                                showModalWithProductDetails(productData);
                                await qrReader.stop();
                                document.getElementById('qr-reader').innerHTML = ''; // Clear the QR reader area
                            } else {
                                alert('El formato de datos QR no es válido.');
                            }
                        } catch (error) {
                            console.error('Error handling QR data:', error);
                        }
                    },
                    (errorMessage) => {
                        //console.warn(`QR Code no leído: ${errorMessage}`);
                    }
                ).catch(err => {
                    console.error('Error starting QR reader:', err);
                });
            });
        } else {
            console.error("Element with ID 'scan-qr' not found.");
        }

        const confirmAddProductButton = document.getElementById('confirm-add-product');
        if (confirmAddProductButton) {
            confirmAddProductButton.addEventListener('click', async () => {
                if (scannedProduct) {
                    await handleAddOrUpdateProduct(scannedProduct);
                    $('#product-details-modal').modal('hide');
                    scannedProduct = null;
                }
            });
        } else {
            console.error("Element with ID 'confirm-add-product' not found.");
        }
    }

    initialize();
});

function parseQRData(qrData) {
    // Supongamos que el formato de los datos del QR es: "id=1;providerId=1;name=Producto1;quantity=10"
    const data = qrData.split(';');
    const product = {};

    data.forEach(item => {
        const [key, value] = item.split('=');
        if (key && value) {
            product[key] = isNaN(value) ? value : parseInt(value);
        }
    });

    if (product.id && product.providerId && product.name && product.quantity) {
        return product;
    }

    return null;
}

function showModalWithProductDetails(product) {
    document.getElementById('modal-product-id').innerText = product.id;
    document.getElementById('modal-provider-id').innerText = product.providerId;
    document.getElementById('modal-product-name').innerText = product.name;
    document.getElementById('modal-product-quantity').innerText = product.quantity;
    $('#product-details-modal').modal('show');
}
