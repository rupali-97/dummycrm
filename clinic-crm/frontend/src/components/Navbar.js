import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ user, onLogout }) => {
  return (
    <header className="navbar">
      <div className="navbar-content">
        <button className="menu-toggle">☰</button>
        <h1 className="navbar-title">Clinic CRM</h1>
        <div className="navbar-user">
          <span>{user.username} ({user.role})</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
