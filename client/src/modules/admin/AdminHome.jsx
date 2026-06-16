import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import Toast from '../common/Toast';

const AdminHome = ({ auth }) => {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const usersResponse = await api.get('/admin/users');
      const propertiesResponse = await api.get('/admin/properties');
      setUsers(usersResponse.data);
      setProperties(propertiesResponse.data);
    } catch (error) {
      setMessage('Unable to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const approveOwner = async (userId) => {
    try {
      await api.put(`/admin/approve-owner/${userId}`);
      setMessage('Owner approved successfully');
      loadData();
    } catch (error) {
      setMessage('Approval failed');
    }
  };

  if (loading) return <div className="container py-5"><p>Loading...</p></div>;

  const pendingOwners = users.filter((u) => u.role === 'owner' && !u.approved);
  const approvedOwners = users.filter((u) => u.role === 'owner' && u.approved);
  const tenants = users.filter((u) => u.role === 'tenant');
  const totalProperties = properties.length;
  const availableProperties = properties.filter((p) => p.status === 'available').length;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <div>{auth.user.name}</div>
      </div>
      <Toast message={message} type={message.includes('failed') ? 'danger' : 'success'} />
      
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white p-3">
            <h6>Total Users</h6>
            <h2>{users.length}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white p-3">
            <h6>Total Properties</h6>
            <h2>{totalProperties}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white p-3">
            <h6>Available Properties</h6>
            <h2>{availableProperties}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark p-3">
            <h6>Pending Owner Approvals</h6>
            <h2>{pendingOwners.length}</h2>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card p-4">
            <h4>Pending Owner Approvals</h4>
            {pendingOwners.length === 0 ? (
              <p className="text-muted">No pending owner approvals</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Location</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingOwners.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.currentLocation || 'N/A'}</td>
                        <td>
                          <button className="btn btn-sm btn-success" onClick={() => approveOwner(user._id)}>Approve</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card p-4 mb-4">
            <h5>User Statistics</h5>
            <p><strong>Approved Owners:</strong> {approvedOwners.length}</p>
            <p><strong>Tenants:</strong> {tenants.length}</p>
            <p><strong>Total Users:</strong> {users.length}</p>
          </div>
          <div className="card p-4">
            <h5>Property Statistics</h5>
            <p><strong>Total Properties:</strong> {totalProperties}</p>
            <p><strong>Available:</strong> {availableProperties}</p>
            <p><strong>Booked:</strong> {totalProperties - availableProperties}</p>
          </div>
        </div>
      </div>

      <div className="card p-4 mt-4">
        <h4>All Users</h4>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className={`badge ${user.role === 'admin' ? 'bg-danger' : user.role === 'owner' ? 'bg-warning' : 'bg-info'}`}>{user.role}</span></td>
                  <td>{user.approved ? <span className="badge bg-success">Approved</span> : <span className="badge bg-secondary">Pending</span>}</td>
                  <td>{user.currentLocation || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
