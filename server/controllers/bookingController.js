const Booking = require('../models/Booking');
const Property = require('../models/Property');
const BookingHistory = require('../models/BookingHistory');

const createBooking = async (req, res) => {
  try {
    const { propertyId, startDate, endDate } = req.body;
    const property = await Property.findById(propertyId);
    if (!property || property.status === 'booked') {
      return res.status(400).json({ message: 'Property unavailable' });
    }

    const booking = await Booking.create({
      property: propertyId,
      tenant: req.user._id,
      startDate,
      endDate,
    });

    property.status = 'booked';
    await property.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user._id }).populate('property');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Fetching bookings failed', error: error.message });
  }
};

const getOwnerBookings = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id });
    const propertyIds = properties.map((item) => item._id);
    const bookings = await Booking.find({ property: { $in: propertyIds } }).populate('tenant', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Fetching owner bookings failed', error: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('property');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    booking.status = req.body.status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Updating booking failed', error: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getOwnerBookings, updateBookingStatus };
