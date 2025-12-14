const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');

// @route   POST api/expenses
// @desc    Add an expense
// @access  Private (Admin only usually)
router.post('/', auth, async (req, res) => {
    const { description, amount, date } = req.body;

    try {
        const newExpense = new Expense({
            description,
            amount,
            date,
            addedBy: req.user.id
        });

        const expense = await newExpense.save();
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/expenses/:month/:year
// @desc    Get expenses by month
// @access  Private
router.get('/:month/:year', auth, async (req, res) => {
    try {
        const { month, year } = req.params;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const expenses = await Expense.find({
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: -1 });

        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
