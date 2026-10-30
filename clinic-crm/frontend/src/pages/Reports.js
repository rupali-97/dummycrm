import { useState, useEffect } from 'react';
import api from '../services/api';

const Reports = () => {
  const [stats, setStats] = useState({});
  const [appointmentStatus, setAppointmentStatus] = useState([]);
  const [billingStatus, setBillingStatus] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [s, a, b, r] = await Promise.all([
        api.get('/reports/dashboard-stats'),
        api.get('/reports/appointments-by-status'),
        api.get('/reports/billing-by-status'),
        api.get('/reports/recent-appointments')
      ]);
      setStats(s.data);
      setAppointmentStatus(a.data.data);
      setBillingStatus(b.data.data);
      setRecent(r.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Reports</h1>
        <p className="subtitle">Clinic analytics and key metrics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalPatients || 0}</div>
          <div className="stat-label">Total Patients</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalDoctors || 0}</div>
          <div className="stat-label">Total Doctors</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.scheduledAppointments || 0}</div>
          <div className="stat-label">Scheduled Appointments</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${(stats.totalRevenue || 0).toFixed(2)}</div>
          <div className="stat-label">Total Revenue (Paid)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.todayAppointments || 0}</div>
          <div className="stat-label">Today's Appointments</div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Appointments by Status</h3>
          <div className="chart-list">
            {appointmentStatus.map((item) => (
              <div key={item.status} className="chart-row">
                <span>{item.status}</span>
                <span className="chart-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-card">
          <h3>Billing by Status</h3>
          <div className="chart-list">
            {billingStatus.map((item) => (
              <div key={item.status} className="chart-row">
                <span>{item.status}</span>
                <span className="chart-count">${parseFloat(item.total || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="table-card">
        <h3>Recent Appointments</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((item) => (
              <tr key={item.id}>
                <td>{item.patient_name}</td>
                <td>{item.doctor_name}</td>
                <td>{item.appointment_date}</td>
                <td>{item.appointment_time}</td>
                <td><span className={`badge ${item.status}`}>{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
