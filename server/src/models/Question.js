const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    categoryId: {
        type: String,
        required: true,
        index: true
    },
    front: {
        type: String,
        required: true
    },
    back: {
        type: String,
        required: true
    },
    intensity: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);
