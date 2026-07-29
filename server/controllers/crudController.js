const Hospital = require('../models/Hospital');
const PoliceStation = require('../models/PoliceStation');
const FireStation = require('../models/FireStation');
const FirstAidGuide = require('../models/FirstAidGuide');
const Feedback = require('../models/Feedback');

const getModel = (modelName) => {
  switch (modelName) {
    case 'hospitals': return Hospital;
    case 'policestations': return PoliceStation;
    case 'firestations': return FireStation;
    case 'guides': return FirstAidGuide;
    case 'feedback': return Feedback;
    default: return null;
  }
};

// @desc    Get all items
// @route   GET /api/admin/:model
// @access  Private/Admin
const getItems = async (req, res) => {
  try {
    const Model = getModel(req.params.model);
    if (!Model) return res.status(400).json({ message: 'Invalid model' });
    const items = await Model.find({});
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create an item
// @route   POST /api/admin/:model
// @access  Private/Admin
const createItem = async (req, res) => {
  try {
    const Model = getModel(req.params.model);
    if (!Model) return res.status(400).json({ message: 'Invalid model' });
    const item = await Model.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update an item
// @route   PUT /api/admin/:model/:id
// @access  Private/Admin
const updateItem = async (req, res) => {
  try {
    const Model = getModel(req.params.model);
    if (!Model) return res.status(400).json({ message: 'Invalid model' });
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete an item
// @route   DELETE /api/admin/:model/:id
// @access  Private/Admin
const deleteItem = async (req, res) => {
  try {
    const Model = getModel(req.params.model);
    if (!Model) return res.status(400).json({ message: 'Invalid model' });
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem,
};
