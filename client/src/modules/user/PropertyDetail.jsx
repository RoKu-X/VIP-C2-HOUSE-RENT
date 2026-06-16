import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import Toast from '../common/Toast';

const PropertyDetail = ({ auth }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({ startDate: '', endDate: '', details: '' });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        setMessage('Property not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!auth || auth.user.role !== 'tenant') {
      setMessage('Only renters can book properties');
      return;
    }
    try {
      await api.post('/bookings', {
        propertyId: id,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      setMessage('Booking request submitted! Status is pending. The owner will review it.');
      setShowBookingForm(false);
      setFormData({ startDate: '', endDate: '', details: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return <div className="container py-5"><p>Loading...</p></div>;
  if (!property) return <div className="container py-5"><p>Property not found</p></div>;

  return (
    <div className="container py-5">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>Back</button>
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h2>{property.title}</h2>
              <p className="text-muted">{property.location}</p>
              <p>{property.description}</p>
              
              <div className="row mt-4">
                <div className="col-md-6">
                  <p><strong>Rent Amount:</strong> ${property.rentAmount}/month</p>
                  <p><strong>Property Type:</strong> {property.propertyType}</p>
                  <p><strong>Furnishing:</strong> {property.furnishingStatus}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Status:</strong> <span className={`badge ${property.status === 'available' ? 'bg-success' : 'bg-danger'}`}>{property.status}</span></p>
                  <p><strong>Amenities:</strong></p>
                  <div>
                    {property.amenities && property.amenities.length > 0 ? (
                      property.amenities.map((amenity, idx) => (
                        <span key={idx} className="badge bg-info me-2 mb-2">{amenity}</span>
                      ))
                    ) : (
                      <span>No amenities listed</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5>Owner Information</h5>
              <p><strong>Name:</strong> {property.owner?.name}</p>
              <p><strong>Email:</strong> {property.owner?.email}</p>
              <p><strong>Location:</strong> {property.owner?.currentLocation || 'Not specified'}</p>
            </div>
          </div>

          {property.status === 'available' && auth?.user?.role === 'tenant' && (
            <div className="card">
              <div className="card-body">
                {!showBookingForm ? (
                  <button className="btn btn-primary w-100" onClick={() => setShowBookingForm(true)}>
                    Get Info & Book
                  </button>
                ) : (
                  <form onSubmit={handleBooking}>
                    <h6>Booking Details</h6>
                    <div className="mb-3">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-success w-100 mb-2">Submit Request</button>
                    <button
                      type="button"
                      className="btn btn-secondary w-100"
                      onClick={() => setShowBookingForm(false)}
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Toast message={message} type={message.includes('failed') || message.includes('not') ? 'danger' : 'success'} />
    </div>
  );
};

export default PropertyDetail;
