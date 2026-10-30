import { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    scheduledAppointments: 0,
    totalRevenue: 0,
    todayAppointments: 0
  });
  const [appointmentStatus, setAppointmentStatus] = useState([]);
  const [billingStatus, setBillingStatus] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [s, a, b, r] = await Promise.all([
          api.get('/reports/dashboard-stats'),
          api.get('/reports/appointments-by-status'),
          api.get('/reports/billing-by-status'),
          api.get('/reports/recent-appointments')
        ]);
        setStats(s.data);
        setAppointmentStatus(a.data.data || []);
        setBillingStatus(b.data.data || []);
        setRecent(r.data.data || []);
      } catch (err) {
        console.error(err);
        addToast('error', 'Failed to load dashboard', 'Could not retrieve clinic overview.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="page">Loading clinic overview...</div>;

  const statCards = [
    { label: 'Total Patients', value: stats.totalPatients, icon: '👥', color: 'success' },
    { label: 'Total Doctors', value: stats.totalDoctors, icon: '👨‍⚕️', color: 'info' },
    { label: 'Scheduled', value: stats.scheduledAppointments, icon: '📅', color: 'warning' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: '💰', color: 'success' },
    { label: "Today's Visits", value: stats.todayAppointments, icon: '🏥', color: 'primary' }
  ];

  const quickActions = [
    { label: 'Add Patient', icon: '👥', to: '/patients' },
    { label: 'Add Doctor', icon: '👨‍⚕️', to: '/doctors' },
    { label: 'Book Appointment', icon: '📅', to: '/appointments' },
    { label: 'New Billing', icon: '💳', to: '/billing' }
  ];

  return (
    <div className="page">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`} role="alert" aria-live="polite">
          <span className="toast-icon">{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}</span>
          <div className="toast-body">
            <span className="toast-title">{t.title}</span>
            {t.message}
          </div>
          <button className="toast-close" onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} aria-label="Dismiss">×</button>
        </div>
      ))}
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome back to your clinic management overview</p>
        </div>
        <div className="header-actions">
          <a href="/appointments" className="btn btn-primary">+ Book Appointment</a>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="stat-info">
              <div className="stat-label">{card.label}</div>
              <div className={`stat-value ${card.color}`}>{card.value}</div>
            </div>
            <div className={`stat-icon bg-${card.color}`}>{card.icon}</div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          {quickActions.map((action) => (
            <a key={action.label} href={action.to} className="action-card">
              <span className="action-icon">{action.icon}</span>
              <h4>{action.label}</h4>
              <p>Get started in one tap</p>
            </a>
          ))}
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Appointments by Status</h3>
          <div className="chart-list">
            {appointmentStatus.length > 0 ? (
              appointmentStatus.map((item) => (
                <div key={item.status} className="chart-row">
                  <span className="chart-label">{item.status}</span>
                  <span className="chart-count">{item.count}</span>
                </div>
              ))
            ) : (
              <div className="chart-row"><span className="chart-label">No data</span><span className="chart-count">0</span></div>
            )}
          </div>
        </div>
        <div className="chart-card">
          <h3>Billing by Status</h3>
          <div className="chart-list">
            {billingStatus.length > 0 ? (
              billingStatus.map((item) => (
                <div key={item.status} className="chart-row">
                  <span className="chart-label">{item.status}</span>
                  <span className="chart-count">${parseFloat(item.total || 0).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="chart-row"><span className="chart-label">No data</span><span className="chart-count">$0.00</span></div>
            )}
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <h3>Recent Appointments</h3>
          <a href="/appointments" className="btn btn-sm btn-outline">View All</a>
        </div>
        {recent.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No appointments yet</h3>
            <p>Book your first appointment to see it here.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th><th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((item) => (
                <tr key={item.id}>
                  <td><span className="name-cell">{item.patient_name}</span></td>
                  <td><span className="meta-cell">{item.doctor_name}</span></td>
                  <td><span className="meta-cell">{item.appointment_date}</span></td>
                  <td><span className="meta-cell">{item.appointment_time}</span></td>
                  <td><span className={`badge ${item.status}`}>{item.status}</span></td>
                  <td><span className="meta-cell">{item.reason || '-'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
