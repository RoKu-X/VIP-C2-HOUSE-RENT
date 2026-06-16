const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { createProperty, updateProperty, deleteProperty, getAllProperties } = require('../controllers/propertyController');

router.use(authMiddleware, roleMiddleware(['owner']));
router.post('/properties', createProperty);
router.put('/properties/:id', updateProperty);
router.delete('/properties/:id', deleteProperty);
router.get('/properties', getAllProperties);

module.exports = router;
