import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api';
import Toast from '../../common/Toast';
import AllPropertiesCards from '../AllPropertiesCards';

const RenterHome = ({ auth, onLogout }) => {
  const [bookings, setBookings] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsResponse = await api.get('/bookings/me');
        setBookings(bookingsResponse.data);
        
        const propsResponse = await api.get('/properties?status=available');
        setRecentProperties(propsResponse.data.slice(0, 6));
      } catch (error) {
        setMessage('Could not load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="container py-5"><p>Loading...</p></div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Renter Dashboard</h1>
        <div>
          <span className="me-3">{auth.user.name}</span>
          <button className="btn btn-outline-secondary btn-sm" onClick={onLogout}>Logout</button>
        </div>
      </div>
      <div className="mb-4">
        <Link to="/properties" className="btn btn-primary me-2">Browse All Properties</Link>
      </div>
      <Toast message={message} type="warning" />
      
      <div className="mb-5">
        <h4 className="mb-3">Your Bookings</h4>
        {bookings.length === 0 ? (
          <div className="alert alert-info">
            <p>You have not booked any property yet.</p>
            <Link to="/properties" className="btn btn-primary btn-sm">Start browsing properties</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Period</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.property?.title}</td>
                    <td>{booking.property?.owner?.name}</td>
                    <td><span className={`badge ${booking.status === 'confirmed' ? 'bg-success' : booking.status === 'pending' ? 'bg-warning' : 'bg-danger'}`}>{booking.status}</span></td>
                    <td>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/property/${booking.property?._id}`} className="btn btn-sm btn-info">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h4 className="mb-3">Featured Available Properties</h4>
        {recentProperties.length === 0 ? (
          <p>No properties available currently.</p>
        ) : (
          <div className="row g-3">
            {recentProperties.map((property) => (
              <div className="col-md-6 col-lg-4" key={property._id}>
                <AllPropertiesCards property={property} canBook={true} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RenterHome;
