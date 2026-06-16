import { useEffect, useState } from 'react';
import api from '../../../api';
import Toast from '../../common/Toast';

const OwnerAllProperties = ({ auth }) => {
  const [properties, setProperties] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/properties', { params: { owner: auth.user.id } });
        setProperties(response.data.filter((p) => p.owner?._id === auth.user.id));
      } catch (error) {
        setMessage('Unable to load your properties');
      }
    };
    if (auth) load();
  }, [auth]);

  return (
    <div className="card p-4 mt-4">
      <h4>Your Properties</h4>
      <Toast message={message} />
      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div className="list-group">
          {properties.map((property) => (
            <div className="list-group-item" key={property._id}>
              <h5>{property.title}</h5>
              <p>{property.location} - ${property.rentAmount}</p>
              <p>Status: {property.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerAllProperties;
