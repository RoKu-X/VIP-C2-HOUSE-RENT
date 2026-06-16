const mongoose = require('mongoose');

const bookingHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  viewedOn: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('BookingHistory', bookingHistorySchema);
