const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getAllProperties, getPropertyById } = require('../controllers/propertyController');

router.get('/properties', getAllProperties);
router.get('/properties/:id', getPropertyById);

module.exports = router;
