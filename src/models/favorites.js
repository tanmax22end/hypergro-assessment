const mongoose = require("mongoose");

const favoriteStock = new mongoose.Schema({
    userId: Number,
    stockName: String,
    stockId: Number
});

module.exports = mongoose.model('favoriteStock', favoriteStock);