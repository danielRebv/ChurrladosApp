const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');

// Obtener todos los proveedores
router.get('/', async (req, res) => {
    try {
        const providers = await Provider.find();
        res.json(providers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Agregar un nuevo proveedor
router.post('/', async (req, res) => {
    const provider = new Provider({
        id: req.body.id,
        service: req.body.service,
        city: req.body.city
    });

    try {
        const newProvider = await provider.save();
        res.status(201).json(newProvider);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
