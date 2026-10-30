import { useState, useEffect } from 'react';
import api from '../services/api';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '', specialty: '', license_number: ''
  });
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
      const res = await api.get('/doctors');
      setDoctors(res.data.doctors || []);
      setFiltered(res.data.doctors || []);
    } catch (err) { console.error(err); addToast('error', 'Failed to load doctors', 'Please try again.'); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);
    setFiltered(doctors.filter(d =>
      `${d.first_name} ${d.last_name}`.toLowerCase().includes(term) ||
      d.specialty.toLowerCase().includes(term) ||
      (d.email || '').toLowerCase().includes(term)
    ));
  };

  const openCreate = () => { setEditing(false); setForm({first_name:'',last_name:'',email:'',phone:'',specialty:'',license_number:''}); setOpen(true); };
  const openEdit = (d) => { setEditing(true); setForm({...d}); setOpen(true); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) await api.put(`/doctors/${form.id || 0}`, form);
      else await api.post('/doctors', form);
      setOpen(false);
      await load();
      addToast('success', editing ? 'Doctor updated' : 'Doctor created', 'The doctor record was saved successfully.');
    } catch (err) { setError(err.response?.data?.error || 'Operation failed.'); addToast('error', 'Save failed', 'Could not save the doctor.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor? Appointments linked to this doctor will also be removed.')) return;
    try { await api.delete(`/doctors/${id}`); await load(); addToast('success', 'Doctor deleted', 'Record removed successfully.'); }
    catch (err) { setError(err.response?.data?.error || 'Delete failed.'); addToast('error', 'Delete failed', 'Could not remove the doctor.'); }
  };

  if (loading) return <div className="page">Loading doctors...</div>;

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
          <h1>Doctors</h1>
          <p className="subtitle">Manage clinic physicians and specialists</p>
        </div>
        <div className="header-actions header-search">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search by name, specialty or email" value={search} onChange={handleSearch} />
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Doctor</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {filtered.length === 0 ? (
        <div className="table-card">
          <div className="empty-state">
            <div className="empty-icon">👨‍⚕️</div>
            <h3>{search ? 'No doctors found' : 'No doctors yet'}</h3>
            <p>{search ? 'Try a different keyword.' : 'Add your first physician to get started.'}</p>
            {!search && <button className="btn btn-primary" onClick={openCreate}>+ Add Doctor</button>}
          </div>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-card-header">
            <h3>Doctor Directory ({filtered.length})</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th><th>Specialty</th><th>Email</th><th>Phone</th><th>License</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td><span className="name-cell">{d.first_name} {d.last_name}</span></td>
                  <td><span className="badge">{d.specialty}</span></td>
                  <td><span className="meta-cell">{d.email}</span></td>
                  <td><span className="meta-cell">{d.phone || '-'}</span></td>
                  <td><span className="meta-cell">{d.license_number}</span></td>
                  <td className="actions">
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(d)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(d.id)}>Delete</button>
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
          <h3>{editing ? 'Edit Doctor' : 'Add Doctor'}</h3>
          <p className="modal-subtitle">{editing ? 'Update physician details.' : 'Register a new doctor.'}</p>
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
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Specialty</label>
                <input name="specialty" value={form.specialty} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>License Number</label>
                <input name="license_number" value={form.license_number} onChange={handleChange} required />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editing ? 'Update Doctor' : 'Create Doctor'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
