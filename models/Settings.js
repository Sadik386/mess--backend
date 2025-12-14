const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    mealRate: {
        type: Number,
        required: true,
        default: 0
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Ensure only one settings document per month/year
SettingsSchema.index({ month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Settings', SettingsSchema);
