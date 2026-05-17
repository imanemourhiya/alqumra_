import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FiFilm, FiUsers, FiDollarSign, FiPercent, FiGrid, FiLogOut, FiPlus, FiEdit, FiTrash2, FiX, FiCalendar, FiCheck } from 'react-icons/fi';
import { MOVIES, CINEMAS, BOOKINGS, SESSIONS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const SALES_DATA = [
  { month: 'Jan', revenue: 48000 }, { month: 'Fév', revenue: 52000 },
  { month: 'Mar', revenue: 61000 }, { month: 'Avr', revenue: 55000 },
  { month: 'Mai', revenue: 72000 }, { month: 'Jun', revenue: 68000 },
  { month: 'Jul', revenue: 89000 },
];
const DAILY_DATA = [
  { day: 'Lun', bookings: 42 }, { day: 'Mar', bookings: 38 },
  { day: 'Mer', bookings: 65 }, { day: 'Jeu', bookings: 51 },
  { day: 'Ven', bookings: 94 }, { day: 'Sam', bookings: 118 },
  { day: 'Dim', bookings: 102 },
];
const OCCUPANCY_DATA = [{ name: 'Vendus', value: 68 }, { name: 'Disponibles', value: 32 }];
const COLORS = ['var(--accent)', 'var(--border)'];
const CHART_STYLE = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)' };

const MOCK_STAFF = [
  { id: 1, name: 'Ahmed Nouri',       email: 'ahmed@alqumra.ma',   role: 'Staff',   status: 'Actif' },
  { id: 2, name: 'Fatima Zahra',      email: 'fatima@alqumra.ma',  role: 'Staff',   status: 'Actif' },
  { id: 3, name: 'Karim Benali',      email: 'karim@alqumra.ma',   role: 'Manager', status: 'Actif' },
  { id: 4, name: 'Nadia El Haj',      email: 'nadia@alqumra.ma',   role: 'Staff',   status: 'Repos' },
  { id: 5, name: 'Youssef El Amrani', email: 'youssef@alqumra.ma', role: 'Admin',   status: 'Actif' },
];

const EMPTY_FILM    = { title: '', year: new Date().getFullYear(), rating: '', status: 'now', poster: '' };
const EMPTY_STAFF   = { name: '', email: '', role: 'Staff' };
const EMPTY_CINEMA  = { name: '', city: '', halls: '', totalSeats: '' };
const EMPTY_SESSION = { movieId: '', cinemaId: '', date: '', time: '', format: 'Standard', price: '' };

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-card card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="icon-btn" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">{children}</div>
      </motion.div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onClose }) {
  return (
    <Modal title="Confirmation" onClose={onClose}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>{message}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
        <button className="btn btn-danger" onClick={() => { onConfirm(); onClose(); }}>Supprimer</button>
      </div>
    </Modal>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('overview');

  // Entity states
  const [films,    setFilms]    = useState(MOVIES.map(m => ({ ...m })));
  const [staff,    setStaff]    = useState(MOCK_STAFF);
  const [cinemas,  setCinemas]  = useState(CINEMAS.map(c => ({ ...c })));
  const [sessions, setSessions] = useState(SESSIONS.map(s => ({ ...s })));

  // Modal state: { type, item } or null
  const [modal,   setModal]   = useState(null);
  const [confirm, setConfirm] = useState(null); // { message, onConfirm }

  // Form states
  const [filmForm,    setFilmForm]    = useState(EMPTY_FILM);
  const [staffForm,   setStaffForm]   = useState(EMPTY_STAFF);
  const [cinemaForm,  setCinemaForm]  = useState(EMPTY_CINEMA);
  const [sessionForm, setSessionForm] = useState(EMPTY_SESSION);

  const openAdd  = (type, emptyForm, setForm) => { setForm(emptyForm); setModal({ type, item: null }); };
  const openEdit = (type, item, setForm)      => { setForm({ ...item }); setModal({ type, item }); };
  const closeModal = () => setModal(null);

  /* ─── CRUD helpers ─── */
  const saveFilm = () => {
    if (!filmForm.title) return;
    if (modal.item) setFilms(p => p.map(f => f.id === modal.item.id ? { ...filmForm, id: modal.item.id } : f));
    else setFilms(p => [...p, { ...filmForm, id: Date.now(), nowShowing: filmForm.status === 'now' }]);
    closeModal();
  };
  const deleteFilm = id => setFilms(p => p.filter(f => f.id !== id));

  const saveStaff = () => {
    if (!staffForm.name || !staffForm.email) return;
    if (modal.item) setStaff(p => p.map(s => s.id === modal.item.id ? { ...staffForm, id: modal.item.id } : s));
    else setStaff(p => [...p, { ...staffForm, id: Date.now(), status: 'Actif' }]);
    closeModal();
  };
  const deleteStaff = id => setStaff(p => p.filter(s => s.id !== id));

  const saveCinema = () => {
    if (!cinemaForm.name) return;
    if (modal.item) setCinemas(p => p.map(c => c.id === modal.item.id ? { ...cinemaForm, id: modal.item.id } : c));
    else setCinemas(p => [...p, { ...cinemaForm, id: Date.now() }]);
    closeModal();
  };
  const deleteCinema = id => setCinemas(p => p.filter(c => c.id !== id));

  const saveSession = () => {
    if (!sessionForm.movieId || !sessionForm.date || !sessionForm.time) return;
    if (modal.item) setSessions(p => p.map(s => s.id === modal.item.id ? { ...sessionForm, id: modal.item.id } : s));
    else setSessions(p => [...p, { ...sessionForm, id: Date.now() }]);
    closeModal();
  };
  const deleteSession = id => setSessions(p => p.filter(s => s.id !== id));

  const TABS = [
    { id: 'overview',  label: 'Vue générale', icon: <FiGrid /> },
    { id: 'movies',    label: 'Films',        icon: <FiFilm /> },
    { id: 'staff',     label: 'Staff',        icon: <FiUsers /> },
    { id: 'cinemas',   label: 'Cinémas',      icon: <FiPercent /> },
    { id: 'schedules', label: 'Séances',      icon: <FiCalendar /> },
  ];

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="staff-brand">
          <img src="/logo.jpg" alt="Al-Qumra Admin" style={{ height: '40px', width: 'auto', borderRadius: '50%' }} />
          <span className="logo-text">ADMIN</span>
        </div>
        {user && (
          <div className="admin-user-info">
            <img src={user.avatar} alt="" className="admin-avatar" />
            <div>
              <div className="admin-user-name">{user.name}</div>
              <span className="role-badge-admin">Admin</span>
            </div>
          </div>
        )}
        <nav className="staff-nav">
          {TABS.map(t => (
            <button key={t.id} className={`staff-nav-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
        <Link to="/" className="staff-nav-btn" style={{ marginTop: 'auto', color: 'var(--text-muted)' }}>
          <FiLogOut /> Retour au site
        </Link>
        <button className="staff-nav-btn" style={{ color: '#cc6666' }} onClick={logout}>
          <FiLogOut /> Déconnexion
        </button>
      </aside>

      <main className="admin-main">

        {/* ===== OVERVIEW ===== */}
        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="staff-title">Vue générale</h2>
            <div className="admin-stats">
              {[
                { icon: <FiDollarSign />, label: 'Chiffre d\'affaires (Jul)', value: '89 000 MAD', trend: '+18%' },
                { icon: <FiFilm />, label: 'Films actifs', value: films.filter(m => m.nowShowing).length, trend: '+2' },
                { icon: <FiUsers />, label: 'Réservations / semaine', value: BOOKINGS.length, trend: '+12%' },
                { icon: <FiPercent />, label: 'Taux d\'occupation', value: '68%', trend: '+5%' },
              ].map(stat => (
                <div key={stat.label} className="admin-stat-card card">
                  <div className="asc-icon">{stat.icon}</div>
                  <div className="asc-value">{stat.value}</div>
                  <div className="asc-label">{stat.label}</div>
                  <div className="asc-trend">{stat.trend}</div>
                </div>
              ))}
            </div>
            <div className="admin-charts">
              <div className="admin-chart-card card">
                <h4 className="chart-title">Revenus mensuels (MAD)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={SALES_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={CHART_STYLE} />
                    <Bar dataKey="revenue" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="admin-chart-card card">
                <h4 className="chart-title">Réservations journalières</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={DAILY_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={CHART_STYLE} />
                    <Line type="monotone" dataKey="bookings" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3, fill: 'var(--accent)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="admin-chart-card card">
                <h4 className="chart-title">Taux d'occupation</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={OCCUPANCY_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                      {OCCUPANCY_DATA.map((_, i) => <Cell key={i} fill={i === 0 ? 'var(--accent)' : 'var(--bg-surface)'} />)}
                    </Pie>
                    <Tooltip contentStyle={CHART_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="admin-chart-card card">
                <h4 className="chart-title">Top films du mois</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={films.filter(m => m.nowShowing).slice(0, 5).map((m, i) => ({ title: m.title.slice(0, 14), tickets: 400 - i * 55 }))} layout="vertical" margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="title" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip contentStyle={CHART_STYLE} />
                    <Bar dataKey="tickets" fill="var(--accent)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== FILMS ===== */}
        {tab === 'movies' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="staff-page-header">
              <h2 className="staff-title" style={{ margin: 0 }}>Gérer les films</h2>
              <button className="btn btn-primary small-btn" onClick={() => openAdd('film', EMPTY_FILM, setFilmForm)}>
                <FiPlus /> Ajouter un film
              </button>
            </div>
            <div className="staff-table-wrap">
              <table className="staff-table">
                <thead><tr><th>Titre</th><th>Année</th><th>Note</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>
                  {films.map(m => (
                    <tr key={m.id}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={m.poster} alt="" style={{ width: 32, borderRadius: 2 }} />
                        {m.title}
                      </td>
                      <td>{m.year}</td>
                      <td>{m.rating}</td>
                      <td>{m.nowShowing ? <span className="badge badge-gold">En salle</span> : <span className="badge badge-dark">Prochainement</span>}</td>
                      <td style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline small-btn" onClick={() => openEdit('film', { ...m, status: m.nowShowing ? 'now' : 'soon' }, setFilmForm)} title="Modifier"><FiEdit /></button>
                        <button className="btn btn-danger small-btn" onClick={() => setConfirm({ message: `Supprimer "${m.title}" ?`, onConfirm: () => deleteFilm(m.id) })} title="Supprimer"><FiTrash2 /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ===== STAFF ===== */}
        {tab === 'staff' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="staff-page-header">
              <h2 className="staff-title" style={{ margin: 0 }}>Gérer le staff</h2>
              <button className="btn btn-primary small-btn" onClick={() => openAdd('staff', EMPTY_STAFF, setStaffForm)}>
                <FiPlus /> Ajouter un membre
              </button>
            </div>
            <div className="staff-table-wrap">
              <table className="staff-table">
                <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>
                  {staff.map(s => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{s.email}</td>
                      <td><span className={`badge ${s.role === 'Admin' ? 'badge-admin' : s.role === 'Manager' ? 'badge-gold' : 'badge-dark'}`}>{s.role}</span></td>
                      <td><span className={`status-dot ${s.status === 'Actif' ? 'status-dot--on' : 'status-dot--off'}`}>{s.status}</span></td>
                      <td style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline small-btn" onClick={() => openEdit('staff', s, setStaffForm)} title="Modifier"><FiEdit /></button>
                        <button className="btn btn-danger small-btn" onClick={() => setConfirm({ message: `Retirer ${s.name} du staff ?`, onConfirm: () => deleteStaff(s.id) })} title="Supprimer"><FiTrash2 /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ===== CINEMAS ===== */}
        {tab === 'cinemas' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="staff-page-header">
              <h2 className="staff-title" style={{ margin: 0 }}>Gérer les cinémas</h2>
              <button className="btn btn-primary small-btn" onClick={() => openAdd('cinema', EMPTY_CINEMA, setCinemaForm)}>
                <FiPlus /> Ajouter un cinéma
              </button>
            </div>
            <div className="staff-table-wrap">
              <table className="staff-table">
                <thead><tr><th>Nom</th><th>Ville</th><th>Salles</th><th>Places</th><th>Actions</th></tr></thead>
                <tbody>
                  {cinemas.map(c => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.city}</td>
                      <td>{c.halls}</td>
                      <td>{c.totalSeats}</td>
                      <td style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline small-btn" onClick={() => openEdit('cinema', c, setCinemaForm)} title="Modifier"><FiEdit /></button>
                        <button className="btn btn-danger small-btn" onClick={() => setConfirm({ message: `Supprimer "${c.name}" ?`, onConfirm: () => deleteCinema(c.id) })} title="Supprimer"><FiTrash2 /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ===== SCHEDULES ===== */}
        {tab === 'schedules' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="staff-page-header">
              <h2 className="staff-title" style={{ margin: 0 }}>Gérer les séances</h2>
              <button className="btn btn-primary small-btn" onClick={() => openAdd('session', EMPTY_SESSION, setSessionForm)}>
                <FiPlus /> Ajouter une séance
              </button>
            </div>
            <div className="staff-table-wrap">
              <table className="staff-table">
                <thead><tr><th>Film</th><th>Cinéma</th><th>Date</th><th>Heure</th><th>Format</th><th>Salle</th><th>Prix</th><th>Actions</th></tr></thead>
                <tbody>
                  {sessions.map(s => {
                    const movie  = films.find(m => m.id === s.movieId);
                    const cinema = cinemas.find(c => c.id === s.cinemaId);
                    return (
                      <tr key={s.id}>
                        <td>{movie?.title ?? '—'}</td>
                        <td>{cinema?.city ?? '—'}</td>
                        <td>{s.date}</td>
                        <td>{s.time}</td>
                        <td><span className="badge badge-dark">{s.format}</span></td>
                        <td>{s.hallId}</td>
                        <td>{s.price} MAD</td>
                        <td style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-outline small-btn" onClick={() => openEdit('session', s, setSessionForm)} title="Modifier"><FiEdit /></button>
                          <button className="btn btn-danger small-btn" onClick={() => setConfirm({ message: `Supprimer cette séance ?`, onConfirm: () => deleteSession(s.id) })} title="Supprimer"><FiTrash2 /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>

      {/* ===== MODALS ===== */}
      <AnimatePresence>
        {/* Film modal */}
        {modal?.type === 'film' && (
          <Modal title={modal.item ? 'Modifier le film' : 'Ajouter un film'} onClose={closeModal}>
            <div className="modal-form">
              <div className="form-group"><label className="form-label">Titre</label><input className="form-input" value={filmForm.title} onChange={e => setFilmForm(f => ({ ...f, title: e.target.value }))} placeholder="Titre du film" /></div>
              <div className="modal-row">
                <div className="form-group"><label className="form-label">Année</label><input className="form-input" type="number" value={filmForm.year} onChange={e => setFilmForm(f => ({ ...f, year: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Note</label><input className="form-input" type="number" step="0.1" min="0" max="10" value={filmForm.rating} onChange={e => setFilmForm(f => ({ ...f, rating: e.target.value }))} placeholder="8.5" /></div>
              </div>
              <div className="form-group"><label className="form-label">Statut</label>
                <select className="form-input" value={filmForm.status} onChange={e => setFilmForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="now">En salle</option>
                  <option value="soon">Prochainement</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">URL Affiche</label><input className="form-input" value={filmForm.poster} onChange={e => setFilmForm(f => ({ ...f, poster: e.target.value }))} placeholder="https://..." /></div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={saveFilm}><FiCheck /> Enregistrer</button>
            </div>
          </Modal>
        )}

        {/* Staff modal */}
        {modal?.type === 'staff' && (
          <Modal title={modal.item ? 'Modifier le membre' : 'Ajouter un membre'} onClose={closeModal}>
            <div className="modal-form">
              <div className="form-group"><label className="form-label">Nom complet</label><input className="form-input" value={staffForm.name} onChange={e => setStaffForm(f => ({ ...f, name: e.target.value }))} placeholder="Nom" /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={staffForm.email} onChange={e => setStaffForm(f => ({ ...f, email: e.target.value }))} placeholder="email@alqumra.ma" /></div>
              <div className="form-group"><label className="form-label">Rôle</label>
                <select className="form-input" value={staffForm.role} onChange={e => setStaffForm(f => ({ ...f, role: e.target.value }))}>
                  <option>Staff</option><option>Manager</option><option>Admin</option>
                </select>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={saveStaff}><FiCheck /> Enregistrer</button>
            </div>
          </Modal>
        )}

        {/* Cinema modal */}
        {modal?.type === 'cinema' && (
          <Modal title={modal.item ? 'Modifier le cinéma' : 'Ajouter un cinéma'} onClose={closeModal}>
            <div className="modal-form">
              <div className="form-group"><label className="form-label">Nom</label><input className="form-input" value={cinemaForm.name} onChange={e => setCinemaForm(f => ({ ...f, name: e.target.value }))} placeholder="Al-Qumra Casablanca" /></div>
              <div className="form-group"><label className="form-label">Ville</label><input className="form-input" value={cinemaForm.city} onChange={e => setCinemaForm(f => ({ ...f, city: e.target.value }))} placeholder="Casablanca" /></div>
              <div className="modal-row">
                <div className="form-group"><label className="form-label">Nb salles</label><input className="form-input" type="number" value={cinemaForm.halls} onChange={e => setCinemaForm(f => ({ ...f, halls: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Places totales</label><input className="form-input" type="number" value={cinemaForm.totalSeats} onChange={e => setCinemaForm(f => ({ ...f, totalSeats: e.target.value }))} /></div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={saveCinema}><FiCheck /> Enregistrer</button>
            </div>
          </Modal>
        )}

        {/* Session modal */}
        {modal?.type === 'session' && (
          <Modal title={modal.item ? 'Modifier la séance' : 'Ajouter une séance'} onClose={closeModal}>
            <div className="modal-form">
              <div className="form-group"><label className="form-label">Film</label>
                <select className="form-input" value={sessionForm.movieId} onChange={e => setSessionForm(f => ({ ...f, movieId: Number(e.target.value) }))}>
                  <option value="">— Sélectionner —</option>
                  {films.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Cinéma</label>
                <select className="form-input" value={sessionForm.cinemaId} onChange={e => setSessionForm(f => ({ ...f, cinemaId: Number(e.target.value) }))}>
                  <option value="">— Sélectionner —</option>
                  {cinemas.map(c => <option key={c.id} value={c.id}>{c.name} — {c.city}</option>)}
                </select>
              </div>
              <div className="modal-row">
                <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={sessionForm.date} onChange={e => setSessionForm(f => ({ ...f, date: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Heure</label><input className="form-input" type="time" value={sessionForm.time} onChange={e => setSessionForm(f => ({ ...f, time: e.target.value }))} /></div>
              </div>
              <div className="modal-row">
                <div className="form-group"><label className="form-label">Format</label>
                  <select className="form-input" value={sessionForm.format} onChange={e => setSessionForm(f => ({ ...f, format: e.target.value }))}>
                    <option>Standard</option><option>3D</option><option>IMAX</option><option>VIP</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Prix (MAD)</label><input className="form-input" type="number" value={sessionForm.price} onChange={e => setSessionForm(f => ({ ...f, price: e.target.value }))} placeholder="65" /></div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={saveSession}><FiCheck /> Enregistrer</button>
            </div>
          </Modal>
        )}

        {/* Confirm delete modal */}
        {confirm && (
          <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onClose={() => setConfirm(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
