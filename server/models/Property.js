const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  rentAmount: { type: Number, required: true },
  propertyType: { type: String, enum: ['house', 'apartment', 'room', 'other'], default: 'house' },
  furnishingStatus: { type: String, enum: ['furnished', 'semi-furnished', 'unfurnished'], default: 'unfurnished' },
  amenities: { type: [String], default: [] },
  images: { type: [String], default: [] },
  status: { type: String, enum: ['available', 'booked'], default: 'available' },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
