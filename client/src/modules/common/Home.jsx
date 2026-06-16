import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

const Home = ({ auth, onLogout }) => {
  return (
    <div className="bg-light">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">🏠 HouseRent</h1>
          <div>
            {auth ? (
              <>
                <span className="me-3">{auth.user.name} <span className="badge bg-info">{auth.user.role}</span></span>
                <button className="btn btn-outline-secondary btn-sm" onClick={onLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link className="btn btn-primary me-2" to="/login">Login</Link>
                <Link className="btn btn-outline-primary" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2>Find Your Perfect Rental Property</h2>
            <p className="lead">Search properties, submit booking requests, and manage rentals all in one place.</p>
            {auth ? (
              <>
                {auth.user.role === 'owner' && !auth.user.approved && (
                  <div className="alert alert-warning mb-3">
                    <strong>Pending Approval:</strong> Admin is reviewing your owner account. You'll be able to list properties once approved.
                  </div>
                )}
                <Button variant="contained" color="primary" component={Link} to={auth.user.role === 'owner' ? '/owner' : auth.user.role === 'admin' ? '/admin' : '/renter'} size="large">
                  Go to Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button variant="contained" color="primary" component={Link} to="/properties" size="large" className="me-3">
                  Browse Properties
                </Button>
                <Button variant="outlined" color="primary" component={Link} to="/register" size="large">
                  Get Started
                </Button>
              </>
            )}
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Why Choose HouseRent?</h5>
                <ul className="list-unstyled">
                  <li>✓ Easy property search with advanced filters</li>
                  <li>✓ Fast booking and approval process</li>
                  <li>✓ Direct communication with owners</li>
                  <li>✓ Secure and verified listings</li>
                  <li>✓ Admin-verified owner accounts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {!auth && (
          <>
            <hr className="my-5" />
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card h-100 text-center p-4">
                  <h5>👤 For Renters</h5>
                  <p>Browse available properties, apply filters, and submit booking requests</p>
                  <Link to="/register?role=tenant" className="btn btn-outline-primary btn-sm">Register as Renter</Link>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 text-center p-4">
                  <h5>🏘️ For Owners</h5>
                  <p>List your properties and manage bookings from renter requests</p>
                  <Link to="/register?role=owner" className="btn btn-outline-primary btn-sm">Register as Owner</Link>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 text-center p-4">
                  <h5>👨‍💼 Admin</h5>
                  <p>Manage users and verify owner accounts</p>
                  <p className="text-muted small">Admin accounts created by system</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
