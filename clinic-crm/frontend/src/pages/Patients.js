import { useState, useEffect } from 'react';
import api from '../services/api';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    date_of_birth: '', gender: '', address: ''
  });
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await api.get('/patients');
      setPatients(res.data.patients);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(false); setForm({first_name:'',last_name:'',email:'',phone:'',date_of_birth:'',gender:'',address:''}); setOpen(true); };
  const openEdit = (p) => { setEditing(true); setForm({...p}); setOpen(true); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) await api.put(`/patients/${form.id || 0}`, form);
      else await api.post('/patients', form);
      setOpen(false);
      load();
    } catch (err) { setError(err.response?.data?.error || 'Operation failed.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient?')) return;
    try { await api.delete(`/patients/${id}`); load(); }
    catch (err) { setError(err.response?.data?.error || 'Delete failed.'); }
  };

  if (loading) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Patients</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Patient</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th><th>DOB</th><th>Gender</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id}>
                <td>{p.first_name} {p.last_name}</td>
                <td>{p.email || '-'}</td>
                <td>{p.phone || '-'}</td>
                <td>{p.date_of_birth || '-'}</td>
                <td>{p.gender || '-'}</td>
                <td className="actions">
                  <button className="btn btn-sm btn-outline" onClick={() => openEdit(p)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`modal ${open ? 'open' : ''}`}>
        <div className="modal-overlay" onClick={() => setOpen(false)} />
        <div className="modal-content">
          <h3>{editing ? 'Edit Patient' : 'Add Patient'}</h3>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input name="first_name" value={form.first_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input name="last_name" value={form.last_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group full">
                <label>Address</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows="2" />
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

export default Patients;
