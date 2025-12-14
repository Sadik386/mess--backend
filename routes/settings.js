const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Settings = require('../models/Settings');

// @route   POST api/settings
// @desc    Update meal rate for a specific month/year
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
    const { mealRate, month, year } = req.body;

    try {
        // Check if settings already exist for this month/year
        let settings = await Settings.findOne({ month, year });

        if (settings) {
            // Update existing settings
            settings.mealRate = mealRate;
            settings.updatedBy = req.user.id;
            await settings.save();
        } else {
            // Create new settings
            settings = new Settings({
                mealRate,
                month,
                year,
                updatedBy: req.user.id
            });
            await settings.save();
        }

        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/settings/:month/:year
// @desc    Get settings for a specific month/year
// @access  Private
router.get('/:month/:year', auth, async (req, res) => {
    try {
        const { month, year } = req.params;
        const settings = await Settings.findOne({ month: parseInt(month), year: parseInt(year) });

        if (!settings) {
            return res.json({ mealRate: 0, month: parseInt(month), year: parseInt(year) });
        }

        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/settings/current
// @desc    Get current month's settings
// @access  Private
router.get('/current', auth, async (req, res) => {
    try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const settings = await Settings.findOne({ month, year });

        if (!settings) {
            return res.json({ mealRate: 0, month, year });
        }

        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
