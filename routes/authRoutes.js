const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Asegúrate de que esta ruta sea correcta

const router = express.Router();
const SECRET_KEY = 'your_secret_key';

// Ruta de login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Ruta de registro
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Ruta de recuperación de contraseña
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Aquí iría la lógica para enviar un correo electrónico con el enlace de recuperación de contraseña
        res.status(200).json({ message: 'Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.' });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
