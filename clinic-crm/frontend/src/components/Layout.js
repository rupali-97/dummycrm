import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Outlet />;

  return (
    <div className="app-layout">
      <Sidebar user={user} onLogout={logout} />
      <div className="app-body">
        <Navbar user={user} onLogout={logout} />
        <main className="app-main"><Outlet /></main>
      </div>
    </div>
  );
};

export default Layout;
