const mongoose = require("mongoose");

const stockinfo = new mongoose.Schema({
    SC_CODE: Number,
    SC_NAME: String,
    SC_GROUP: String,
    SC_TYPE: String,
    OPEN: Number,
    HIGH: Number,
    LOW: Number,
    CLOSE: Number,
    LAST: Number,
    PREVCLOSE: Number,
    NO_TRADES: Number,
    NO_OF_SHRS: Number,
    NET_TURNOV: Number,
    TIMESTAMP: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StockDetails', stockinfo);