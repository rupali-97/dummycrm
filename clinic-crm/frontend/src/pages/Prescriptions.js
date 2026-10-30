import { useState, useEffect } from 'react';
import api from '../services/api';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ appointment_id: '', patient_id: '', doctor_id: '', medication: '', dosage: '', instructions: '' });
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [pr, p, d, a] = await Promise.all([
        api.get('/prescriptions'), api.get('/patients'), api.get('/doctors'), api.get('/appointments')
      ]);
      setPrescriptions(pr.data.prescriptions);
      setPatients(p.data.patients);
      setDoctors(d.data.doctors);
      setAppointments(a.data.appointments);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(false); setForm({ appointment_id: '', patient_id: '', doctor_id: '', medication: '', dosage: '', instructions: '' }); setOpen(true); };
  const openEdit = (pr) => { setEditing(true); setForm({ ...pr }); setOpen(true); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) await api.put(`/prescriptions/${form.id || 0}`, form);
      else await api.post('/prescriptions', form);
      setOpen(false);
      load();
    } catch (err) { setError(err.response?.data?.error || 'Operation failed.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this prescription?')) return;
    try { await api.delete(`/prescriptions/${id}`); load(); }
    catch (err) { setError(err.response?.data?.error || 'Delete failed.'); }
  };

  if (loading) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Prescriptions</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Prescription</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th><th>Doctor</th><th>Medication</th><th>Dosage</th><th>Instructions</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((pr) => (
              <tr key={pr.id}>
                <td>{pr.patient_first_name} {pr.patient_last_name}</td>
                <td>{pr.doctor_first_name} {pr.doctor_last_name}</td>
                <td>{pr.medication}</td>
                <td>{pr.dosage || '-'}</td>
                <td>{pr.instructions || '-'}</td>
                <td>{new Date(pr.prescribed_date).toLocaleDateString()}</td>
                <td className="actions">
                  <button className="btn btn-sm btn-outline" onClick={() => openEdit(pr)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(pr.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`modal ${open ? 'open' : ''}`}>
        <div className="modal-overlay" onClick={() => setOpen(false)} />
        <div className="modal-content">
          <h3>{editing ? 'Edit Prescription' : 'Add Prescription'}</h3>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Appointment</label>
                <select name="appointment_id" value={form.appointment_id} onChange={handleChange} required>
                  <option value="">Select appointment</option>
                  {appointments.map((a) => <option key={a.id} value={a.id}>Appointment #{a.id}</option>)}
                </select>
              </div>
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
                  {doctors.map((d) => <option key={d.id} value={d.id}>{d.first_name} {d.last_name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Medication</label>
                <input name="medication" value={form.medication} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Dosage</label>
                <input name="dosage" value={form.dosage} onChange={handleChange} />
              </div>
              <div className="form-group full">
                <label>Instructions</label>
                <textarea name="instructions" value={form.instructions} onChange={handleChange} rows="2" required />
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

export default Prescriptions;
