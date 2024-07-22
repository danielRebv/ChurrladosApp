const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProviderSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    service: { type: String, required: true },
    city: { type: String, required: true }
});

module.exports = mongoose.model('Provider', ProviderSchema);
