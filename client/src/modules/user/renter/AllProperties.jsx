import { useEffect, useState } from 'react';
import api from '../../../api';
import Toast from '../../common/Toast';
import AllPropertiesCards from '../AllPropertiesCards';

const AllProperties = ({ auth }) => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({ location: '', minRent: '', maxRent: '', propertyType: '', status: '' });
  const [message, setMessage] = useState('');

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties', { params: filters });
      setProperties(response.data);
    } catch (error) {
      setMessage('Could not load properties');
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    fetchProperties();
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Properties</h1>
        {auth && <span>{auth.user.name} ({auth.user.role})</span>}
      </div>
      <div className="card p-4 mb-4">
        <h5>Search Filters</h5>
        <form className="row g-3" onSubmit={applyFilters}>
          <div className="col-md-3">
            <input name="location" className="form-control" placeholder="Location" value={filters.location} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <input name="minRent" type="number" className="form-control" placeholder="Min Rent" value={filters.minRent} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <input name="maxRent" type="number" className="form-control" placeholder="Max Rent" value={filters.maxRent} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <select name="propertyType" className="form-select" value={filters.propertyType} onChange={handleChange}>
              <option value="">Property Type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="room">Room</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="col-md-2">
            <select name="status" className="form-select" value={filters.status} onChange={handleChange}>
              <option value="">Status</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
            </select>
          </div>
          <div className="col-md-1 d-grid">
            <button className="btn btn-primary">Search</button>
          </div>
        </form>
      </div>
      <Toast message={message} type="info" />
      <div className="row g-3">
        {properties.map((property) => (
          <div className="col-md-6" key={property._id}>
            <AllPropertiesCards property={property} canBook={auth?.user?.role === 'tenant' && property.status === 'available'} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProperties;
