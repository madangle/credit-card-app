const mongoose = require('mongoose');

const CardSchema = mongoose.Schema({
    name: String,
    number: Number,
    limit: Number,
    balance: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Card', CardSchema);