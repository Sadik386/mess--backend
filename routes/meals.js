const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Meal = require('../models/Meal');
const User = require('../models/User');

// @route   POST api/meals
// @desc    Add/Update meal for a user (Admin only or User for themselves if allowed, but usually Admin)
// @access  Private
router.post('/', auth, async (req, res) => {
    const { userId, date, lunch, dinner, breakfast } = req.body;

    try {
        // Check if meal entry exists for this date and user
        // We need to normalize date to start of day to avoid time issues
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        let meal = await Meal.findOne({
            user: userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (meal) {
            // Update
            if (lunch !== undefined) meal.lunch = lunch;
            if (dinner !== undefined) meal.dinner = dinner;
            if (breakfast !== undefined) meal.breakfast = breakfast;
            await meal.save();
            return res.json(meal);
        }

        // Create new
        meal = new Meal({
            user: userId,
            date: startOfDay,
            lunch: lunch || 0,
            dinner: dinner || 0,
            breakfast: breakfast || 0
        });

        await meal.save();
        res.json(meal);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/meals/:userId/:month/:year
// @desc    Get meals for a user by month
// @access  Private
router.get('/:userId/:month/:year', auth, async (req, res) => {
    try {
        const { userId, month, year } = req.params;

        // Month is 1-indexed in params usually, but JS Date is 0-indexed
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // Last day of month

        const meals = await Meal.find({
            user: userId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        res.json(meals);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
