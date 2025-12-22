const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    themeColor: {
        type: String,
        default: '#9B5CFF'
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
