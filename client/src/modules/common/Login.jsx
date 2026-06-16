import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitLogin = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      const authData = { token: response.data.token, user: response.data.user };
      onLogin(authData);
      if (authData.user.role === 'owner') navigate('/owner');
      else if (authData.user.role === 'admin') navigate('/admin');
      else navigate('/renter');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container py-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: 420 }}>
        <h2>Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submitLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary w-100">Login</button>
        </form>
        <p className="mt-3 text-center">
          New user? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
