const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { createBooking, getMyBookings, getOwnerBookings, updateBookingStatus } = require('../controllers/bookingController');

router.post('/', authMiddleware, roleMiddleware(['tenant']), createBooking);
router.get('/me', authMiddleware, roleMiddleware(['tenant']), getMyBookings);
router.get('/owner', authMiddleware, roleMiddleware(['owner']), getOwnerBookings);
router.put('/:id/status', authMiddleware, roleMiddleware(['owner']), updateBookingStatus);

module.exports = router;
