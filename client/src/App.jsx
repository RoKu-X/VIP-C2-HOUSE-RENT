import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Home from './modules/common/Home';
import Login from './modules/common/Login';
import Register from './modules/common/Register';
import ForgotPassword from './modules/common/ForgotPassword';
import OwnerHome from './modules/user/owner/OwnerHome';
import RenterHome from './modules/user/renter/RenterHome';
import AdminHome from './modules/admin/AdminHome';
import AddProperty from './modules/user/owner/AddProperty';
import AllProperties from './modules/user/renter/AllProperties';
import PropertyDetail from './modules/user/PropertyDetail';

const App = () => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('houserent_auth');
    return stored ? JSON.parse(stored) : null;
  });

  const handleSetAuth = (data) => {
    localStorage.setItem('houserent_auth', JSON.stringify(data));
    setAuth(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('houserent_auth');
    setAuth(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home auth={auth} onLogout={handleLogout} />} />
        <Route path="/login" element={<Login onLogin={handleSetAuth} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/owner" element={auth?.user?.role === 'owner' && auth?.user?.approved ? <OwnerHome auth={auth} onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/owner/add-property" element={auth?.user?.role === 'owner' && auth?.user?.approved ? <AddProperty auth={auth} /> : <Navigate to="/" />} />
        <Route path="/renter" element={auth?.user?.role === 'tenant' ? <RenterHome auth={auth} /> : <Navigate to="/" />} />
        <Route path="/admin" element={auth?.user?.role === 'admin' ? <AdminHome auth={auth} /> : <Navigate to="/" />} />
        <Route path="/properties" element={<AllProperties auth={auth} />} />
        <Route path="/property/:id" element={<PropertyDetail auth={auth} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
