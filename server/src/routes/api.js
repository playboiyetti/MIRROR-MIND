const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Question = require('../models/Question');

// @desc    Get all categories
// @route   GET /api/categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get questions by category
// @route   GET /api/questions/:categoryId
router.get('/questions/:categoryId', async (req, res) => {
    try {
        const questions = await Question.find({ categoryId: req.params.categoryId });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
