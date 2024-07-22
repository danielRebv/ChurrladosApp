const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const providerRoutes = require('./routes/providerRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes'); // Asegúrate de que esta ruta sea correcta

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/inventory')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/providers', providerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes); // Asegúrate de que esta ruta esté incluida

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Reportes
app.get('/api/report/inventory', async (req, res) => {
    try {
        const products = await Product.find();
        const providers = await Provider.find();
        res.json({ products, providers });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener datos del inventario' });
    }
});
