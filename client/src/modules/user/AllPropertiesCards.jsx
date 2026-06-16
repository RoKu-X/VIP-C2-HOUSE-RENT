import { Link } from 'react-router-dom';

const AllPropertiesCards = ({ property, canBook }) => {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h5>{property.title}</h5>
        <p className="mb-1"><strong>Location:</strong> {property.location}</p>
        <p className="mb-1"><strong>Rent:</strong> ${property.rentAmount}/month</p>
        <p className="mb-1"><strong>Type:</strong> {property.propertyType}</p>
        <p className="mb-1"><strong>Furnishing:</strong> {property.furnishingStatus}</p>
        <p className="mb-2">{property.description}</p>
        <p className="mb-3"><strong>Owner:</strong> {property.owner?.name}</p>
        <div className="d-flex gap-2">
          <Link to={`/property/${property._id}`} className="btn btn-info btn-sm flex-grow-1">View Details</Link>
          {canBook && (
            <span className="badge bg-success align-self-center">Available</span>
          )}
          {!canBook && (
            <span className="badge bg-secondary align-self-center">{property.status}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPropertiesCards;
