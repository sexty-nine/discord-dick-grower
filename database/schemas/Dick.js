const { Schema, model } = require('mongoose');

const Dick = new Schema({
    chatId: String,
    userId: String,
    name: String,
    size: Number,
    nextGrowTimestamp: {
        type: Number,
        default: null
    },
    growTime: {
        type: Number,
        default: 12 * 60 * 60 * 1000
    },
    GrowMultiplier: Number,
});

module.exports = model('Dick', Dick);