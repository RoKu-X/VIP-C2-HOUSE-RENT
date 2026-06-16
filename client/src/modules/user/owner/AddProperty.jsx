import { useState } from 'react';
import api from '../../../api';
import Toast from '../../common/Toast';

const AddProperty = ({ auth }) => {
  const [form, setForm] = useState({ title: '', description: '', location: '', rentAmount: '', propertyType: 'house', furnishingStatus: 'unfurnished', amenities: '' });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setSuccess('');
    try {
      const response = await api.post('/properties', {
        ...form,
        rentAmount: Number(form.rentAmount),
        amenities: form.amenities.split(',').map((item) => item.trim()).filter(Boolean),
      });
      setSuccess('Property added successfully');
      setForm({ title: '', description: '', location: '', rentAmount: '', propertyType: 'house', furnishingStatus: 'unfurnished', amenities: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not add property');
    }
  };

  return (
    <div className="container py-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: 700 }}>
        <h2>Add Property</h2>
        <Toast message={message || success} type={message ? 'danger' : 'success'} />
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input name="title" className="form-control" value={form.title} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" value={form.description} onChange={handleChange} rows="3" />
          </div>
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input name="location" className="form-control" value={form.location} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Rent Amount</label>
            <input name="rentAmount" type="number" className="form-control" value={form.rentAmount} onChange={handleChange} required />
          </div>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label">Property Type</label>
              <select name="propertyType" className="form-select" value={form.propertyType} onChange={handleChange}>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="room">Room</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Furnishing</label>
              <select name="furnishingStatus" className="form-select" value={form.furnishingStatus} onChange={handleChange}>
                <option value="unfurnished">Unfurnished</option>
                <option value="semi-furnished">Semi-furnished</option>
                <option value="furnished">Furnished</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Amenities (comma-separated)</label>
            <input name="amenities" className="form-control" value={form.amenities} onChange={handleChange} />
          </div>
          <button className="btn btn-primary">Save Property</button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
