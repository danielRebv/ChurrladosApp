document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordForm = document.getElementById('forgot-password-form');

    forgotPasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();

        if (email) {
            try {
                const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                if (response.ok) {
                    alert('Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.');
                    window.location.href = 'index.html';
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error al recuperar contraseña:', error);
                alert('Ocurrió un error. Por favor, intenta nuevamente.');
            }
        } else {
            alert('Por favor, introduce tu correo electrónico.');
        }
    });
});
