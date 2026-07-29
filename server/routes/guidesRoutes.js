const express = require('express');
const router = express.Router();
const { getGuides, getGuideByCategory } = require('../controllers/guidesController');

router.get('/', getGuides);
router.get('/:category', getGuideByCategory);

module.exports = router;
