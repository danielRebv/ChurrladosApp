document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (username && password) {
            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    // Guardar el token o manejar la sesión del usuario
                    sessionStorage.setItem('authToken', data.token);
                    alert('Inicio de sesión exitoso');
                    // Redirigir al usuario a la página principal o de inventario
                    window.location.href = 'inventory.html';
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                alert('Ocurrió un error. Por favor, intenta nuevamente.');
            }
        } else {
            alert('Por favor, complete todos los campos.');
        }
    });
});
