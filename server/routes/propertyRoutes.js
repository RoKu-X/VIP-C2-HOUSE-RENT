const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { createProperty, getAllProperties, getPropertyById, updateProperty, deleteProperty } = require('../controllers/propertyController');

router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.post('/', authMiddleware, roleMiddleware(['owner']), createProperty);
router.put('/:id', authMiddleware, roleMiddleware(['owner']), updateProperty);
router.delete('/:id', authMiddleware, roleMiddleware(['owner']), deleteProperty);

module.exports = router;
