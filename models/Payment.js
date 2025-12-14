const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['deposit', 'due_payment'],
        default: 'deposit'
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
