const express = require('express');
const router = express.Router();
const { getItems, createItem, updateItem, deleteItem } = require('../controllers/crudController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:model')
  .get(protect, getItems)
  .post(protect, createItem);

router.route('/:model/:id')
  .put(protect, updateItem)
  .delete(protect, deleteItem);

module.exports = router;
