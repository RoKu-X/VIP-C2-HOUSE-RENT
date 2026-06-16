import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../../api';
import Toast from '../../common/Toast';

const OwnerHome = ({ auth, onLogout }) => {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const propsResponse = await api.get('/owner/properties');
      setProperties(propsResponse.data);
      
      const bookingsResponse = await api.get('/bookings/owner');
      setBookings(bookingsResponse.data);
    } catch (error) {
      setMessage('Unable to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      setMessage(`Booking status updated to ${newStatus}`);
      fetchData();
    } catch (error) {
      setMessage('Failed to update booking status');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await api.delete(`/properties/${propertyId}`);
        setMessage('Property deleted successfully');
        fetchData();
      } catch (error) {
        setMessage('Failed to delete property');
      }
    }
  };

  if (loading) return <div className="container py-5"><p>Loading...</p></div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Owner Dashboard</h1>
        <div>
          <span className="me-3">{auth.user.name}</span>
          <button className="btn btn-outline-secondary btn-sm" onClick={onLogout}>Logout</button>
        </div>
      </div>
      <div className="mb-4">
        <Link to="/owner/add-property" className="btn btn-primary me-2">Add Property</Link>
        <Link to="/properties" className="btn btn-secondary">Browse Properties</Link>
      </div>
      <Toast message={message} type={message.includes('Failed') ? 'danger' : 'success'} />
      
      <div className="mb-5">
        <h4 className="mb-3">Your Properties</h4>
        {properties.length === 0 ? (
          <p>No properties added yet.</p>
        ) : (
          <div className="row g-3">
            {properties.map((property) => (
              <div className="col-md-6" key={property._id}>
                <div className="card">
                  <div className="card-body">
                    <h5>{property.title}</h5>
                    <p className="mb-1"><strong>Location:</strong> {property.location}</p>
                    <p className="mb-1"><strong>Rent:</strong> ${property.rentAmount}/month</p>
                    <p className="mb-1"><strong>Type:</strong> {property.propertyType}</p>
                    <p className="mb-3"><strong>Status:</strong> <span className={`badge ${property.status === 'available' ? 'bg-success' : 'bg-danger'}`}>{property.status}</span></p>
                    <div className="d-flex gap-2">
                      <Link to={`/property/${property._id}`} className="btn btn-sm btn-info">View</Link>
                      <Link to={`/owner/edit-property/${property._id}`} className="btn btn-sm btn-warning">Edit</Link>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProperty(property._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h4 className="mb-3">Booking Requests</h4>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Tenant</th>
                  <th>Email</th>
                  <th>Period</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.property?.title}</td>
                    <td>{booking.tenant?.name}</td>
                    <td>{booking.tenant?.email}</td>
                    <td>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</td>
                    <td><span className="badge bg-info">{booking.status}</span></td>
                    <td>
                      {booking.status === 'pending' && (
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-success" onClick={() => handleStatusChange(booking._id, 'confirmed')}>Approve</button>
                          <button className="btn btn-danger" onClick={() => handleStatusChange(booking._id, 'cancelled')}>Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerHome;
