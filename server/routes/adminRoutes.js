const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { getAllUsers, approveOwner, getAllProperties } = require('../controllers/adminController');

router.use(authMiddleware, roleMiddleware(['admin']));
router.get('/users', getAllUsers);
router.put('/approve-owner/:id', approveOwner);
router.get('/properties', getAllProperties);

module.exports = router;
