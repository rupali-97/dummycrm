import { useState, useEffect } from 'react';
import api from '../services/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ patient_id: '', doctor_id: '', appointment_date: '', appointment_time: '', status: 'scheduled', reason: '' });
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);

  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [a, p, d] = await Promise.all([
        api.get('/appointments'), api.get('/patients'), api.get('/doctors')
      ]);
      setAppointments(a.data.appointments || []);
      setFiltered(a.data.appointments || []);
      setPatients(p.data.patients || []);
      setDoctors(d.data.doctors || []);
    } catch (err) { console.error(err); addToast('error', 'Failed to load appointments', 'Please try again.'); }
    finally { setLoading(false); }
  };

  const applyFilters = () => {
    setFiltered(appointments.filter(a => {
      if (filterStatus !== 'all' && a.status !== filterStatus) return false;
      if (filterDoctor !== 'all' && String(a.doctor_id) !== filterDoctor) return false;
      return true;
    }));
  };

  const openCreate = () => { setEditing(false); setForm({ patient_id: '', doctor_id: '', appointment_date: '', appointment_time: '', status: 'scheduled', reason: '' }); setOpen(true); };
  const openEdit = (a) => { setEditing(true); setForm({ ...a, appointment_date: a.appointment_date ? String(a.appointment_date).slice(0, 10) : '', appointment_time: a.appointment_time ? String(a.appointment_time).slice(0, 5) : '' }); setOpen(true); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) await api.put(`/appointments/${form.id || 0}`, form);
      else await api.post('/appointments', form);
      setOpen(false);
      await load();
      addToast('success', editing ? 'Appointment updated' : 'Appointment booked', 'The appointment was saved successfully.');
    } catch (err) { setError(err.response?.data?.error || 'Operation failed.'); addToast('error', 'Save failed', 'Could not save the appointment.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try { await api.delete(`/appointments/${id}`); await load(); addToast('success', 'Appointment deleted', 'Record removed successfully.'); }
    catch (err) { setError(err.response?.data?.error || 'Delete failed.'); addToast('error', 'Delete failed', 'Could not remove the appointment.'); }
  };

  if (loading) return <div className="page">Loading appointments...</div>;

  return (
    <div className="page">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`} role="alert" aria-live="polite">
          <span className="toast-icon">{t.type === 'success' ? '✅' : '❌'}</span>
          <div className="toast-body">
            <span className="toast-title">{t.title}</span>{t.message}
          </div>
          <button className="toast-close" onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} aria-label="Dismiss">×</button>
        </div>
      ))}
      <div className="page-header">
        <div>
          <h1>Appointments</h1>
          <p className="subtitle">Schedule, track and manage patient visits</p>
        </div>
        <div className="header-actions">
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); applyFilters(); }} className="btn btn-ghost btn-sm">
            <option value="all">All statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={filterDoctor} onChange={e => { setFilterDoctor(e.target.value); applyFilters(); }} className="btn btn-ghost btn-sm">
            <option value="all">All doctors</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.first_name} {d.last_name}</option>)}
          </select>
          <button className="btn btn-primary" onClick={openCreate}>+ Book Appointment</button>
        </div>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {filtered.length === 0 ? (
        <div className="table-card">
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>{filterStatus !== 'all' || filterDoctor !== 'all' ? 'No matching appointments' : 'No appointments yet'}</h3>
            <p>{filterStatus !== 'all' || filterDoctor !== 'all' ? 'Adjust your filters to see more results.' : 'Book your first appointment to get started.'}</p>
            <button className="btn btn-primary" onClick={openCreate}>+ Book Appointment</button>
          </div>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-card-header">
            <h3>Appointment Schedule ({filtered.length})</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th><th>Reason</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td><span className="name-cell">{a.patient_first_name} {a.patient_last_name}</span></td>
                  <td><span className="meta-cell">{a.doctor_first_name} {a.doctor_last_name}</span></td>
                  <td><span className="meta-cell">{a.appointment_date}</span></td>
                  <td><span className="meta-cell">{a.appointment_time}</span></td>
                  <td><span className={`badge ${a.status}`}>{a.status}</span></td>
                  <td><span className="meta-cell">{a.reason || '-'}</span></td>
                  <td className="actions">
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(a)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={`modal ${open ? 'open' : ''}`} aria-modal="true" role="dialog">
        <div className="modal-overlay" onClick={() => setOpen(false)} />
        <div className="modal-content">
          <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">×</button>
          <h3>{editing ? 'Edit Appointment' : 'Book Appointment'}</h3>
          <p className="modal-subtitle">{editing ? 'Change visit details.' : 'Schedule a new patient visit.'}</p>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Patient</label>
                <select name="patient_id" value={form.patient_id} onChange={handleChange} required>
                  <option value="">Select patient</option>
                  {patients.map((p) => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Doctor</label>
                <select name="doctor_id" value={form.doctor_id} onChange={handleChange} required>
                  <option value="">Select doctor</option>
                  {doctors.map((d) => <option key={d.id} value={d.id}>{d.first_name} {d.last_name} - {d.specialty}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="appointment_date" value={form.appointment_date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input type="time" name="appointment_time" value={form.appointment_time} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group full">
                <label>Reason</label>
                <textarea name="reason" value={form.reason} onChange={handleChange} rows="2" />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editing ? 'Update Appointment' : 'Book Appointment'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
