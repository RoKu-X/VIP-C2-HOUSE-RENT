const User = require('../models/User');
const Property = require('../models/Property');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Fetching users failed', error: error.message });
  }
};

const approveOwner = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'owner') {
      return res.status(404).json({ message: 'Owner user not found' });
    }
    user.approved = true;
    await user.save();
    res.json({ message: 'Owner approved', user: { id: user._id, email: user.email, role: user.role, approved: user.approved } });
  } catch (error) {
    res.status(500).json({ message: 'Approval failed', error: error.message });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Fetching properties failed', error: error.message });
  }
};

module.exports = { getAllUsers, approveOwner, getAllProperties };
