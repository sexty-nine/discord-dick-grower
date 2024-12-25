const { Schema, model } = require('mongoose');

const Dick = new Schema({
    chatId: String,
    userId: String,
    name: String,
    size: Number,
    lastGrow: {
        type: Date,
        default: null
    },
    tillAnotherGrowTime: {
        type: Date,
        default: null
    },
    GrowMultiplier: Number,
});

module.exports = model('Dick', Dick);