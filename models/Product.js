const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    providerId: { type: Number, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true }
});

module.exports = mongoose.model('Product', ProductSchema);
