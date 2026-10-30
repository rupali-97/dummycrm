import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const menuItems = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/patients', label: 'Patients', icon: '👥' },
    { to: '/doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { to: '/appointments', label: 'Appointments', icon: '📅' },
    { to: '/prescriptions', label: 'Prescriptions', icon: '📝' },
    { to: '/billing', label: 'Billing', icon: '💳' },
    { to: '/reports', label: 'Reports', icon: '📈' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Link to="/dashboard" className="brand-link">ClinicCRM</Link>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`nav-link ${window.location.pathname === item.to ? 'active' : ''}`}
            onClick={() => navigate(item.to)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-name">{user.username}</div>
          <div className="user-role">{user.role}</div>
        </div>
        <button className="btn-logout" onClick={onLogout}>Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;
