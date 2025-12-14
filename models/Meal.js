const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    lunch: {
        type: Number, // 1 or 0 (or more if allowed)
        default: 0
    },
    dinner: {
        type: Number,
        default: 0
    },
    breakfast: { // Optional, but good to have
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Meal', MealSchema);
