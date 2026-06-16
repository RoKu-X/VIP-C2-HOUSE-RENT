const Property = require('../models/Property');

const createProperty = async (req, res) => {
  try {
    const { title, description, location, rentAmount, propertyType, furnishingStatus, amenities, images } = req.body;
    const property = await Property.create({
      owner: req.user._id,
      title,
      description,
      location,
      rentAmount,
      propertyType,
      furnishingStatus,
      amenities: amenities || [],
      images: images || [],
    });
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Property creation failed', error: error.message });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const filters = {};
    if (req.query.location) filters.location = new RegExp(req.query.location, 'i');
    if (req.query.propertyType) filters.propertyType = req.query.propertyType;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.minRent || req.query.maxRent) {
      filters.rentAmount = {};
      if (req.query.minRent) filters.rentAmount.$gte = Number(req.query.minRent);
      if (req.query.maxRent) filters.rentAmount.$lte = Number(req.query.maxRent);
    }

    const properties = await Property.find(filters).populate('owner', 'name email currentLocation');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Fetching properties failed', error: error.message });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email currentLocation');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Fetching property failed', error: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, owner: req.user._id });
    if (!property) return res.status(404).json({ message: 'Property not found or permission denied' });

    const updates = ['title', 'description', 'location', 'rentAmount', 'propertyType', 'furnishingStatus', 'amenities', 'images', 'status'];
    updates.forEach((key) => {
      if (req.body[key] !== undefined) property[key] = req.body[key];
    });

    await property.save();
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!property) return res.status(404).json({ message: 'Property not found or permission denied' });
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Deletion failed', error: error.message });
  }
};

module.exports = { createProperty, getAllProperties, getPropertyById, updateProperty, deleteProperty };
