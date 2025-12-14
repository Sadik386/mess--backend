const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');
const Meal = require('../models/Meal');

// @route   GET api/reports/meal-rate/:month/:year
// @desc    Calculate meal rate for a month (total expenses / total meals)
// @access  Private
router.get('/meal-rate/:month/:year', auth, async (req, res) => {
    try {
        const { month, year } = req.params;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Get total expenses for the month
        const expenses = await Expense.find({
            date: { $gte: startDate, $lte: endDate }
        });
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        // Get total meals for the month
        const meals = await Meal.find({
            date: { $gte: startDate, $lte: endDate }
        });
        const totalMeals = meals.reduce((sum, meal) => {
            return sum + (meal.breakfast || 0) + (meal.lunch || 0) + (meal.dinner || 0);
        }, 0);

        // Calculate meal rate
        const mealRate = totalMeals > 0 ? (totalExpenses / totalMeals).toFixed(2) : 0;

        res.json({
            month: parseInt(month),
            year: parseInt(year),
            totalExpenses,
            totalMeals,
            mealRate: parseFloat(mealRate)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/monthly/:month/:year
// @desc    Get monthly report for all users
// @access  Private
router.get('/monthly/:month/:year', auth, async (req, res) => {
    try {
        const { month, year } = req.params;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Get total expenses for the month
        const expenses = await Expense.find({
            date: { $gte: startDate, $lte: endDate }
        });
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        // Get all meals for the month
        const meals = await Meal.find({
            date: { $gte: startDate, $lte: endDate }
        }).populate('user', 'name email');

        // Calculate total meals
        const totalMeals = meals.reduce((sum, meal) => {
            return sum + (meal.breakfast || 0) + (meal.lunch || 0) + (meal.dinner || 0);
        }, 0);

        // Calculate meal rate
        const mealRate = totalMeals > 0 ? (totalExpenses / totalMeals).toFixed(2) : 0;

        // Get payments for this month
        const Payment = require('../models/Payment');
        const payments = await Payment.find({
            date: { $gte: startDate, $lte: endDate }
        });

        // Group meals by user
        const userMeals = {};
        meals.forEach(meal => {
            const userId = meal.user._id.toString();
            if (!userMeals[userId]) {
                userMeals[userId] = {
                    user: { id: userId, name: meal.user.name, email: meal.user.email },
                    totalMeals: 0,
                    totalDepositThisMonth: 0
                };
            }
            userMeals[userId].totalMeals += (meal.breakfast || 0) + (meal.lunch || 0) + (meal.dinner || 0);
        });

        // Add deposits to user data
        payments.forEach(payment => {
            const userId = payment.user.toString();
            if (userMeals[userId]) {
                userMeals[userId].totalDepositThisMonth += payment.amount;
            }
        });

        // Calculate total cost for each user
        const reports = Object.values(userMeals).map(userData => ({
            ...userData,
            mealRate: parseFloat(mealRate),
            totalCost: (userData.totalMeals * parseFloat(mealRate)).toFixed(2)
        }));

        res.json({
            month: parseInt(month),
            year: parseInt(year),
            totalExpenses,
            totalMeals,
            mealRate: parseFloat(mealRate),
            reports
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
