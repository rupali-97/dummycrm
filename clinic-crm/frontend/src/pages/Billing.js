import { useState, useEffect } from 'react';
import api from '../services/api';

const Billing = () => {
  const [billing, setBilling] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ patient_id: '', appointment_id: '', amount: '', status: 'pending', description: '' });
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [b, p] = await Promise.all([api.get('/billing'), api.get('/patients')]);
      setBilling(b.data.billing);
      setPatients(p.data.patients);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(false); setForm({ patient_id: '', appointment_id: '', amount: '', status: 'pending', description: '' }); setOpen(true); };
  const openEdit = (b) => { setEditing(true); setForm({ ...b }); setOpen(true); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) await api.put(`/billing/${form.id || 0}`, form);
      else await api.post('/billing', form);
      setOpen(false);
      load();
    } catch (err) { setError(err.response?.data?.error || 'Operation failed.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this billing record?')) return;
    try { await api.delete(`/billing/${id}`); load(); }
    catch (err) { setError(err.response?.data?.error || 'Delete failed.'); }
  };

  if (loading) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Billing</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Billing Record</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th><th>Amount</th><th>Status</th><th>Description</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {billing.map((b) => (
              <tr key={b.id}>
                <td>{b.patient_first_name} {b.patient_last_name}</td>
                <td>${parseFloat(b.amount).toFixed(2)}</td>
                <td><span className={`badge ${b.status}`}>{b.status}</span></td>
                <td>{b.description || '-'}</td>
                <td>{new Date(b.billing_date).toLocaleDateString()}</td>
                <td className="actions">
                  <button className="btn btn-sm btn-outline" onClick={() => openEdit(b)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`modal ${open ? 'open' : ''}`}>
        <div className="modal-overlay" onClick={() => setOpen(false)} />
        <div className="modal-content">
          <h3>{editing ? 'Edit Billing Record' : 'Add Billing Record'}</h3>
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
                <label>Appointment (optional)</label>
                <select name="appointment_id" value={form.appointment_id} onChange={handleChange}>
                  <option value="">None</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input type="number" step="0.01" name="amount" value={form.amount} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div className="form-group full">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="2" required />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Billing;
