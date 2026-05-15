import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FiFilm, FiUsers, FiDollarSign, FiPercent, FiGrid, FiLogOut, FiPlus, FiEdit, FiTrash2, FiX, FiCalendar } from 'react-icons/fi';
import { MOVIES, CINEMAS, BOOKINGS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const SALES_DATA = [
  { month: 'Jan', revenue: 48000 }, { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 61000 }, { month: 'Apr', revenue: 55000 },
  { month: 'May', revenue: 72000 }, { month: 'Jun', revenue: 68000 },
  { month: 'Jul', revenue: 89000 },
];
const DAILY_DATA = [
  { day: 'Mon', bookings: 42 }, { day: 'Tue', bookings: 38 },
  { day: 'Wed', bookings: 65 }, { day: 'Thu', bookings: 51 },
  { day: 'Fri', bookings: 94 }, { day: 'Sat', bookings: 118 },
  { day: 'Sun', bookings: 102 },
];
const OCCUPANCY_DATA = [
  { name: 'Sold', value: 68 }, { name: 'Available', value: 32 },
];
const TOP_MOVIES = MOVIES.filter(m => m.nowShowing).slice(0, 5).map((m, i) => ({
  title: m.title.slice(0, 14) + (m.title.length > 14 ? '…' : ''),
  tickets: Math.round(400 - i * 60 + Math.random() * 40),
}));
const COLORS = ['#c8a97e', '#2c2015'];
const CHART_STYLE = { background: '#111', border: '1px solid #3a3020', borderRadius: 6, color: '#f0ebe0' };

const MOCK_STAFF = [
  { id: 1, name: 'Ahmed Nouri',       email: 'ahmed@alqumra.ma',   role: 'Staff',   status: 'Active' },
  { id: 2, name: 'Fatima Zahra',      email: 'fatima@alqumra.ma',  role: 'Staff',   status: 'Active' },
  { id: 3, name: 'Karim Benali',      email: 'karim@alqumra.ma',   role: 'Manager', status: 'Active' },
  { id: 4, name: 'Nadia El Haj',      email: 'nadia@alqumra.ma',   role: 'Staff',   status: 'Off today' },
  { id: 5, name: 'Youssef El Amrani', email: 'youssef@alqumra.ma', role: 'Admin',   status: 'Active' },
];

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

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('overview');
  const [modal, setModal] = useState(null); // null | 'add-film' | 'add-staff'
  const [staff, setStaff] = useState(MOCK_STAFF);
  const [staffForm, setStaffForm] = useState({ name: '', email: '', role: 'Staff' });

  const TABS = [
    { id: 'overview',  label: 'Overview',   icon: <FiGrid /> },
    { id: 'movies',    label: 'Films',       icon: <FiFilm /> },
    { id: 'staff',     label: 'Staff',       icon: <FiUsers /> },
    { id: 'cinemas',   label: 'Cinemas',     icon: <FiPercent /> },
    { id: 'schedules', label: 'Schedules',   icon: <FiCalendar /> },
  ];

  const removeStaff = (id) => setStaff(prev => prev.filter(s => s.id !== id));
  const addStaff = () => {
    if (!staffForm.name || !staffForm.email) return;
    setStaff(prev => [...prev, { id: Date.now(), ...staffForm, status: 'Active' }]);
    setStaffForm({ name: '', email: '', role: 'Staff' });
    setModal(null);
  };

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
            <button key={t.id} className={`staff-nav-btn ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
        <Link to="/" className="staff-nav-btn" style={{marginTop:'auto',color:'var(--text-muted)'}}>
          <FiLogOut /> Exit to Site
        </Link>
        <button className="staff-nav-btn" style={{color:'#cc6666'}} onClick={logout}>
          <FiLogOut /> Logout
        </button>
      </aside>

      <main className="admin-main">

        {/* ===== OVERVIEW ===== */}
        {tab === 'overview' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <h2 className="staff-title">Dashboard Overview</h2>
            <div className="admin-stats">
              {[
                { icon: <FiDollarSign />, label: 'Revenue (Jul)', value: '89,000 MAD', trend: '+18%' },
                { icon: <FiFilm />, label: 'Active Films', value: MOVIES.filter(m=>m.nowShowing).length, trend: '+2' },
                { icon: <FiUsers />, label: 'Bookings This Week', value: BOOKINGS.length, trend: '+12%' },
                { icon: <FiPercent />, label: 'Occupancy Rate', value: '68%', trend: '+5%' },
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
                <h4 className="chart-title">Monthly Revenue (MAD)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={SALES_DATA} margin={{top:8,right:8,left:0,bottom:0}}>
                    <XAxis dataKey="month" tick={{fill:'#6b6560',fontSize:11}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill:'#6b6560',fontSize:11}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={CHART_STYLE} />
                    <Bar dataKey="revenue" fill="#c8a97e" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="admin-chart-card card">
                <h4 className="chart-title">Daily Bookings</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={DAILY_DATA} margin={{top:8,right:8,left:0,bottom:0}}>
                    <XAxis dataKey="day" tick={{fill:'#6b6560',fontSize:11}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill:'#6b6560',fontSize:11}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={CHART_STYLE} />
                    <Line type="monotone" dataKey="bookings" stroke="#c8a97e" strokeWidth={2} dot={{ r: 3, fill: '#c8a97e' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="admin-chart-card card">
                <h4 className="chart-title">Seat Occupancy</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={OCCUPANCY_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" label={({name,value})=>`${name} ${value}%`} labelLine={false}>
                      {OCCUPANCY_DATA.map((_,i)=><Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={CHART_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="admin-chart-card card">
                <h4 className="chart-title">Top Films This Month</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={TOP_MOVIES} layout="vertical" margin={{top:8,right:8,left:0,bottom:0}}>
                    <XAxis type="number" tick={{fill:'#6b6560',fontSize:10}} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="title" tick={{fill:'#b8b0a0',fontSize:10}} axisLine={false} tickLine={false} width={90} />
                    <Tooltip contentStyle={CHART_STYLE} />
                    <Bar dataKey="tickets" fill="#c8a97e" radius={[0,4,4,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== FILMS ===== */}
        {tab === 'movies' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="staff-page-header">
              <h2 className="staff-title" style={{margin:0}}>Manage Films</h2>
              <button className="btn btn-primary small-btn" onClick={()=>setModal('add-film')}><FiPlus /> Add Film</button>
            </div>
            <div className="staff-table-wrap">
              <table className="staff-table">
                <thead><tr><th>Title</th><th>Year</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {MOVIES.map(m => (
                    <tr key={m.id}>
                      <td style={{display:'flex',alignItems:'center',gap:10}}>
                        <img src={m.poster} alt="" style={{width:32,borderRadius:2}} />
                        {m.title}
                      </td>
                      <td>{m.year}</td>
                      <td>⭐ {m.rating}</td>
                      <td>{m.nowShowing ? <span className="badge badge-gold">Showing</span> : <span className="badge badge-dark">Coming Soon</span>}</td>
                      <td style={{display:'flex',gap:6}}>
                        <button className="btn btn-outline small-btn"><FiEdit /></button>
                        <button className="btn btn-danger small-btn"><FiTrash2 /></button>
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
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="staff-page-header">
              <h2 className="staff-title" style={{margin:0}}>Manage Staff</h2>
              <button className="btn btn-primary small-btn" onClick={()=>setModal('add-staff')}><FiPlus /> Add Staff</button>
            </div>
            <div className="staff-table-wrap">
              <table className="staff-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {staff.map(s => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td style={{color:'var(--text-muted)',fontSize:'0.82rem'}}>{s.email}</td>
                      <td>
                        <span className={`badge ${s.role==='Admin'?'badge-admin':s.role==='Manager'?'badge-gold':'badge-dark'}`}>
                          {s.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-dot ${s.status==='Active'?'status-dot--on':'status-dot--off'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td style={{display:'flex',gap:6}}>
                        <button className="btn btn-outline small-btn"><FiEdit /></button>
                        <button className="btn btn-danger small-btn" onClick={()=>removeStaff(s.id)}><FiTrash2 /></button>
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
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="staff-page-header">
              <h2 className="staff-title" style={{margin:0}}>Manage Cinemas</h2>
              <button className="btn btn-primary small-btn"><FiPlus /> Add Cinema</button>
            </div>
            <div className="staff-table-wrap">
              <table className="staff-table">
                <thead><tr><th>Name</th><th>City</th><th>Halls</th><th>Seats</th><th>Actions</th></tr></thead>
                <tbody>
                  {CINEMAS.map(c => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.city}</td>
                      <td>{c.halls}</td>
                      <td>{c.totalSeats}</td>
                      <td style={{display:'flex',gap:6}}>
                        <button className="btn btn-outline small-btn"><FiEdit /></button>
                        <button className="btn btn-danger small-btn"><FiTrash2 /></button>
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
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="staff-page-header">
              <h2 className="staff-title" style={{margin:0}}>Manage Schedules</h2>
              <button className="btn btn-primary small-btn"><FiPlus /> Add Session</button>
            </div>
            <div className="schedule-grid">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <div key={day} className="schedule-day card">
                  <div className="schedule-day-label">{day}</div>
                  {MOVIES.filter(m => m.nowShowing).slice(0, 2 + Math.floor(Math.random() * 2)).map(m => (
                    <div key={m.id} className="schedule-session">
                      <span className="ss-time">{['14:00','16:30','19:00','21:30'][Math.floor(Math.random()*4)]}</span>
                      <span className="ss-title">{m.title.slice(0,18)}</span>
                      <span className="badge badge-dark" style={{fontSize:'0.6rem'}}>H{Math.ceil(Math.random()*4)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* ===== MODALS ===== */}
      <AnimatePresence>
        {modal === 'add-film' && (
          <Modal title="Add Film" onClose={() => setModal(null)}>
            <div className="modal-form">
              <div className="form-group"><label className="form-label">Title</label><input className="form-input" placeholder="Film title" /></div>
              <div className="modal-row">
                <div className="form-group"><label className="form-label">Year</label><input className="form-input" type="number" placeholder="2025" /></div>
                <div className="form-group"><label className="form-label">Rating</label><input className="form-input" type="number" step="0.1" placeholder="8.5" /></div>
              </div>
              <div className="form-group"><label className="form-label">Status</label>
                <select className="form-input">
                  <option value="now">Now Showing</option>
                  <option value="soon">Coming Soon</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Poster URL</label><input className="form-input" placeholder="https://..." /></div>
              <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}}>Save Film</button>
            </div>
          </Modal>
        )}
        {modal === 'add-staff' && (
          <Modal title="Add Staff Member" onClose={() => setModal(null)}>
            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={staffForm.name} onChange={e=>setStaffForm(f=>({...f,name:e.target.value}))} placeholder="Name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={staffForm.email} onChange={e=>setStaffForm(f=>({...f,email:e.target.value}))} placeholder="email@alqumra.ma" />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-input" value={staffForm.role} onChange={e=>setStaffForm(f=>({...f,role:e.target.value}))}>
                  <option>Staff</option>
                  <option>Manager</option>
                  <option>Admin</option>
                </select>
              </div>
              <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}} onClick={addStaff}>Add Staff Member</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
