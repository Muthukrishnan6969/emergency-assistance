const FirstAidGuide = require('../models/FirstAidGuide');

// @desc    Get all first aid guides
// @route   GET /api/guides
// @access  Public
const getGuides = async (req, res) => {
  try {
    const guides = await FirstAidGuide.find({}).select('title category description');
    res.json(guides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get guide by category or ID
// @route   GET /api/guides/:category
// @access  Public
const getGuideByCategory = async (req, res) => {
  try {
    const guide = await FirstAidGuide.findOne({ category: req.params.category });
    if (guide) {
      res.json(guide);
    } else {
      res.status(404).json({ message: 'Guide not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getGuides,
  getGuideByCategory,
};
