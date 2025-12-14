const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Payment = require('../models/Payment');
const User = require('../models/User');

// @route   POST api/payments
// @desc    Add a payment (deposit)
// @access  Private (Admin)
router.post('/', auth, async (req, res) => {
    const { userId, amount, date, type } = req.body;

    try {
        const newPayment = new Payment({
            user: userId,
            amount,
            date,
            type
        });

        await newPayment.save();

        // Update user deposit/balance
        const user = await User.findById(userId);
        if (user) {
            user.deposit += Number(amount);
            // Balance logic might be complex (Balance = Deposit - Cost), so maybe just track Deposit here.
            // We'll calculate Balance dynamically in reports.
            await user.save();
        }

        res.json(newPayment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/payments/:userId
// @desc    Get payments for a user
// @access  Private
router.get('/:userId', auth, async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.params.userId }).sort({ date: -1 });
        res.json(payments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
