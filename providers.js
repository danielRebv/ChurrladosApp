import { fetchProviders } from './api.js';

const providerIdSelect = document.getElementById('provider-id');
const providerLegend = document.getElementById('provider-legend');
let providers = [];

export async function loadProviders() {
    try {
        providers = await fetchProviders();
        console.log('Fetched Providers:', providers); // Verificar la estructura de datos
        if (Array.isArray(providers) && providers.length > 0) {
            renderProviderLegend();
            updateProviderSelect();
        } else {
            console.error("Expected an array of providers but received:", providers);
        }
    } catch (error) {
        console.error("Error loading providers:", error);
    }
}

function renderProviderLegend() {
    providerLegend.innerHTML = '';
    providers.forEach(provider => {
        const providerItem = document.createElement('li');
        providerItem.className = "list-group-item";
        providerItem.textContent = `ID: ${provider.id} - Servicio: ${provider.service} - Ciudad: ${provider.city}`;
        providerLegend.appendChild(providerItem);
    });
}

function updateProviderSelect() {
    providerIdSelect.innerHTML = '<option value="" disabled selected>Seleccione un proveedor</option>';
    providers.forEach(provider => {
        const option = document.createElement('option');
        option.value = provider.id;
        option.textContent = `ID: ${provider.id} - Servicio: ${provider.service} - Ciudad: ${provider.city}`;
        providerIdSelect.appendChild(option);
    });
}

export function getProviders() {
    return providers;
}
