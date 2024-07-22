const API_URL = 'http://localhost:5000/api';

export async function fetchProviders() {
    try {
        const response = await fetch(`${API_URL}/providers`);
        const data = await response.json();
        console.log('API Providers Response:', data); // Depurar respuesta de la API
        if (Array.isArray(data)) {
            return data; // Devolver directamente el array de proveedores
        } else {
            console.error("API response is not as expected:", data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching providers:", error);
        return [];
    }
}

export async function fetchProducts(page, limit) {
    try {
        const response = await fetch(`${API_URL}/products?page=${page}&limit=${limit}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return { products: [], totalPages: 0 };
    }
}

export async function addOrUpdateProduct(product) {
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        return await response.json();
    } catch (error) {
        console.error("Error adding or updating product:", error);
        return null;
    }
}

export async function updateProduct(id, product) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        return await response.json();
    } catch (error) {
        console.error("Error updating product:", error);
        return null;
    }
}

export async function deleteProduct(id) {
    try {
        await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error("Error deleting product:", error);
    }
}
