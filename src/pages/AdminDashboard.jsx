import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FiFilm, FiUsers, FiDollarSign, FiPercent, FiGrid, FiLogOut, FiPlus, FiEdit, FiTrash2, FiX, FiCalendar, FiChevronDown } from 'react-icons/fi';
import { MOVIES, CINEMAS, BOOKINGS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
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
      <motion.div className="modal-card card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={e => e.stopPropagation()}>
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
  const { t, lang } = useLang();
  const [tab, setTab] = useState('overview');
  const [modal, setModal] = useState(null);
  const [staff, setStaff] = useState(MOCK_STAFF);
  const [staffForm, setStaffForm] = useState({ name: '', email: '', role: 'Staff' });
  const [showInfo, setShowInfo] = useState(false);

  const TOP_MOVIES = MOVIES.filter(m => m.nowShowing).slice(0, 5).map((m, i) => ({
    title: m.title.slice(0, 14) + (m.title.length > 14 ? '…' : ''),
    tickets: Math.round(400 - i * 60 + Math.random() * 40),
  }));

  const OCCUPANCY_DATA = [
    { name: lang === 'ar' ? 'مباع' : lang === 'fr' ? 'Vendus' : 'Sold', value: 68 },
    { name: lang === 'ar' ? 'متاح' : lang === 'fr' ? 'Disponibles' : 'Available', value: 32 },
  ];

  const TABS = [
    { id: 'overview',  label: lang === 'ar' ? 'نظرة عامة' : lang === 'fr' ? "Vue d'ensemble" : 'Overview',  icon: <FiGrid /> },
    { id: 'movies',    label: t('films'),                                                                      icon: <FiFilm /> },
    { id: 'staff',     label: 'Staff',                                                                         icon: <FiUsers /> },
    { id: 'cinemas',   label: t('cinemas'),                                                                    icon: <FiPercent /> },
    { id: 'schedules', label: lang === 'ar' ? 'الجداول' : lang === 'fr' ? 'Plannings' : 'Schedules',         icon: <FiCalendar /> },
  ];

  const DAYS = lang === 'ar'
    ? ['الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت','الأحد']
    : lang === 'fr'
    ? ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
    : ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  const removeStaff = (id) => setStaff(prev => prev.filter(s => s.id !== id));
  const addStaff = () => {
    if (!staffForm.name || !staffForm.email) return;
    setStaff(prev => [...prev, { id: Date.now(), ...staffForm, status: 'Active' }]);
    setStaffForm({ name: '', email: '', role: 'Staff' });
    setModal(null);
  };

  const statsLabel = {
    revenue:    lang === 'ar' ? 'الإيرادات (يوليو)' : lang === 'fr' ? 'Revenus (Jul)'            : 'Revenue (Jul)',
    activeFilms:lang === 'ar' ? 'أفلام نشطة'         : lang === 'fr' ? 'Films actifs'              : 'Active Films',
    bookings:   lang === 'ar' ? 'حجوزات / أسبوع'     : lang === 'fr' ? 'Réservations / semaine'   : 'Bookings / week',
    occupancy:  lang === 'ar' ? 'معدل الإشغال'        : lang === 'fr' ? "Taux d'occupation"        : 'Occupancy Rate',
  };

  const chartTitles = {
    monthly:  lang === 'ar' ? 'الإيرادات الشهرية (MAD)' : lang === 'fr' ? 'Revenus mensuels (MAD)'       : 'Monthly Revenue (MAD)',
    daily:    lang === 'ar' ? 'الحجوزات اليومية'          : lang === 'fr' ? 'Réservations quotidiennes'    : 'Daily Bookings',
    occupancy:lang === 'ar' ? 'إشغال المقاعد'             : lang === 'fr' ? 'Occupation des sièges'        : 'Seat Occupancy',
    topFilms: lang === 'ar' ? 'أفضل الأفلام هذا الشهر'   : lang === 'fr' ? 'Top films ce mois'            : 'Top Films This Month',
  };

  const ml = {
    films:     lang === 'ar' ? 'إدارة الأفلام'    : lang === 'fr' ? 'Gérer les films'      : 'Manage Films',
    staff:     lang === 'ar' ? 'إدارة الموظفين'   : lang === 'fr' ? 'Gérer le staff'       : 'Manage Staff',
    cinemas:   lang === 'ar' ? 'إدارة السينمات'   : lang === 'fr' ? 'Gérer les cinémas'    : 'Manage Cinemas',
    schedules: lang === 'ar' ? 'إدارة الجداول'    : lang === 'fr' ? 'Gérer les plannings'  : 'Manage Schedules',
    dashboard: lang === 'ar' ? 'لوحة التحكم'      : lang === 'fr' ? 'Tableau de bord'      : 'Dashboard Overview',
    addFilm:   lang === 'ar' ? 'إضافة فيلم'       : lang === 'fr' ? 'Ajouter un film'      : 'Add Film',
    addStaff:  lang === 'ar' ? 'إضافة موظف'       : lang === 'fr' ? 'Ajouter'              : 'Add Staff',
    addCinema: lang === 'ar' ? 'إضافة سينما'      : lang === 'fr' ? 'Ajouter'              : 'Add Cinema',
    addSession:lang === 'ar' ? 'إضافة جلسة'       : lang === 'fr' ? 'Ajouter une séance'   : 'Add Session',
    showing:   lang === 'ar' ? 'يُعرض الآن'        : lang === 'fr' ? "À l'affiche"          : 'Showing',
    comingSoon:lang === 'ar' ? 'قريباً'            : lang === 'fr' ? 'Prochainement'        : 'Coming Soon',
    title:     lang === 'ar' ? 'العنوان'           : lang === 'fr' ? 'Titre'                : 'Title',
    year:      lang === 'ar' ? 'السنة'             : lang === 'fr' ? 'Année'                : 'Year',
    rating:    lang === 'ar' ? 'التقييم'           : lang === 'fr' ? 'Note'                 : 'Rating',
    status:    lang === 'ar' ? 'الحالة'            : lang === 'fr' ? 'Statut'               : 'Status',
    actions:   lang === 'ar' ? 'إجراءات'           : lang === 'fr' ? 'Actions'              : 'Actions',
    name:      lang === 'ar' ? 'الاسم'             : lang === 'fr' ? 'Nom'                  : 'Name',
    role:      lang === 'ar' ? 'الدور'             : lang === 'fr' ? 'Rôle'                 : 'Role',
    city:      lang === 'ar' ? 'المدينة'           : lang === 'fr' ? 'Ville'                : 'City',
    halls:     lang === 'ar' ? 'القاعات'           : lang === 'fr' ? 'Salles'               : 'Halls',
    seats:     lang === 'ar' ? 'المقاعد'           : lang === 'fr' ? 'Places'               : 'Seats',
    save:      lang === 'ar' ? 'حفظ'               : lang === 'fr' ? 'Enregistrer'          : 'Save',
    posterUrl: lang === 'ar' ? 'رابط الملصق'       : lang === 'fr' ? 'URL Affiche'          : 'Poster URL',
    logout:    lang === 'ar' ? 'تسجيل الخروج'      : lang === 'fr' ? 'Déconnexion'          : 'Logout',
    myInfo:    lang === 'ar' ? 'معلوماتي'          : lang === 'fr' ? 'Mes infos'            : 'My Info',
    since:     lang === 'ar' ? 'منذ'               : lang === 'fr' ? 'Membre depuis'        : 'Since',
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="staff-brand">
          <img src="/logo.jpg" alt="Al-Qumra Admin" style={{ height: '40px', width: 'auto', borderRadius: '50%' }} />
          <span className="logo-text">ADMIN</span>
        </div>

        {user && (
          <>
            <button className="admin-info-btn" onClick={() => setShowInfo(v => !v)}>
              <img src={user.avatar} alt="" className="admin-avatar" />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div className="admin-user-name">{user.name}</div>
                <span className="role-badge-admin">Admin</span>
              </div>
              <FiChevronDown style={{ fontSize: '0.8rem', color: 'var(--text-muted)', transform: showInfo ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {showInfo && (
              <div className="admin-info-panel">
                <div className="aip-row"><span>Email</span><span>{user.email || 'admin@alqumra.ma'}</span></div>
                <div className="aip-row"><span>{ml.role}</span><span className="role-badge-admin">Admin</span></div>
                <div className="aip-row"><span>{ml.since}</span><span>Jan 2024</span></div>
                <div className="aip-row"><span>Points</span><span style={{ color: 'var(--accent)' }}>∞</span></div>
              </div>
            )}
          </>
        )}

        <nav className="staff-nav">
          {TABS.map(tb => (
            <button key={tb.id} className={`staff-nav-btn ${tab === tb.id ? 'active' : ''}`} onClick={() => setTab(tb.id)}>
              {tb.icon} {tb.label}
            </button>
          ))}
        </nav>
        <Link to="/" className="staff-nav-btn" style={{ marginTop: 'auto', color: 'var(--text-muted)' }}>
          <FiLogOut /> {t('exitToSite')}
        </Link>
        <button className="staff-nav-btn" style={{ color: '#cc6666' }} onClick={logout}>
          <FiLogOut /> {ml.logout}
        </button>
      </aside>

      <main className="admin-main">
        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="staff-title">{ml.dashboard}</h2>
            <div className="admin-stats">
              {[
                { icon: <FiDollarSign />, label: statsLabel.revenue,     value: '89,000 MAD',                          trend: '+18%' },
                { icon: <FiFilm />,       label: statsLabel.activeFilms,  value: MOVIES.filter(m=>m.nowShowing).length, trend: '+2'   },
                { icon: <FiUsers />,      label: statsLabel.bookings,     value: BOOKINGS.length,                       trend: '+12%' },
                { icon: <FiPercent />,    label: statsLabel.occupancy,    value: '68%',                                 trend: '+5%'  },
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
                <h4 className="chart-title">{chartTitles.monthly}</h4>
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
                <h4 className="chart-title">{chartTitles.daily}</h4>
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
                <h4 className="chart-title">{chartTitles.occupancy}</h4>
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
                <h4 className="chart-title">{chartTitles.topFilms}</h4>
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

        {tab === 'movies' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="staff-page-header">
              <h2 className="staff-title" style={{margin:0}}>{ml.films}</h2>
              <button className="btn btn-primary small-btn" onClick={()=>setModal('add-film')}><FiPlus /> {ml.addFilm}</button>
            </div>
            <div className="staff-table-wrap">
              <table className="staff-table">
                <thead><tr><th>{ml.title}</th><th>{ml.year}</th><th>{ml.rating}</th><th>{ml.status}</th><th>{ml.actions}</th></tr></thead>
                <tbody>
                  {MOVIES.map(m => (
                    <tr key={m.id}>
                      <td style={{display:'flex',alignItems:'center',gap:10}}>
                        <img src={m.poster} alt="" style={{width:32,borderRadius:2}} />{m.title}
                      </td>
                      <td>{m.year}</td>
                      <td>⭐ {m.rating}</td>
                      <td>{m.nowShowing ? <span className="badge badge-gold">{ml.showing}</span> : <span className="badge badge-dark">{ml.comingSoon}</span>}</td>
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

        {tab === 'staff' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="staff-page-header">
              <h2 className="staff-title" style={{margin:0}}>{ml.staff}</h2>
              <button className="btn btn-primary small-btn" onClick={()=>setModal('add-staff')}><FiPlus /> {ml.addStaff}</button>
            </div>
            <div className="staff-table-wrap">
              <table className="staff-table">
                <thead><tr><th>{ml.name}</th><th>Email</th><th>{ml.role}</th><th>{ml.status}</th><th>{ml.actions}</th></tr></thead>
                <tbody>
                  {staff.map(s => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td style={{color:'var(--text-muted)',fontSize:'0.82rem'}}>{s.email}</td>
                      <td><span className={`badge ${s.role==='Admin'?'badge-admin':s.role==='Manager'?'badge-gold':'badge-dark'}`}>{s.role}</span></td>
                      <td><span className={`status-dot ${s.status==='Active'?'status-dot--on':'status-dot--off'}`}>{s.status}</span></td>
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

        {tab === 'cinemas' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="staff-page-header">
              <h2 className="staff-title" style={{margin:0}}>{ml.cinemas}</h2>
              <button className="btn btn-primary small-btn"><FiPlus /> {ml.addCinema}</button>
            </div>
            <div className="staff-table-wrap">
              <table className="staff-table">
                <thead><tr><th>{ml.name}</th><th>{ml.city}</th><th>{ml.halls}</th><th>{ml.seats}</th><th>{ml.actions}</th></tr></thead>
                <tbody>
                  {CINEMAS.map(c => (
                    <tr key={c.id}>
                      <td>{c.name}</td><td>{c.city}</td><td>{c.halls}</td><td>{c.totalSeats}</td>
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

        {tab === 'schedules' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="staff-page-header">
              <h2 className="staff-title" style={{margin:0}}>{ml.schedules}</h2>
              <button className="btn btn-primary small-btn"><FiPlus /> {ml.addSession}</button>
            </div>
            <div className="schedule-grid">
              {DAYS.map(day => (
                <div key={day} className="schedule-day card">
                  <div className="schedule-day-label">{day}</div>
                  {MOVIES.filter(m => m.nowShowing).slice(0, 2).map(m => (
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

      <AnimatePresence>
        {modal === 'add-film' && (
          <Modal title={ml.addFilm} onClose={() => setModal(null)}>
            <div className="modal-form">
              <div className="form-group"><label className="form-label">{ml.title}</label><input className="form-input" placeholder={ml.title} /></div>
              <div className="modal-row">
                <div className="form-group"><label className="form-label">{ml.year}</label><input className="form-input" type="number" placeholder="2025" /></div>
                <div className="form-group"><label className="form-label">{ml.rating}</label><input className="form-input" type="number" step="0.1" placeholder="8.5" /></div>
              </div>
              <div className="form-group"><label className="form-label">{ml.status}</label>
                <select className="form-input">
                  <option value="now">{ml.showing}</option>
                  <option value="soon">{ml.comingSoon}</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">{ml.posterUrl}</label><input className="form-input" placeholder="https://..." /></div>
              <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}}>{ml.save}</button>
            </div>
          </Modal>
        )}
        {modal === 'add-staff' && (
          <Modal title={ml.addStaff} onClose={() => setModal(null)}>
            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">{t('fullName')}</label>
                <input className="form-input" value={staffForm.name} onChange={e=>setStaffForm(f=>({...f,name:e.target.value}))} placeholder={t('fullName')} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={staffForm.email} onChange={e=>setStaffForm(f=>({...f,email:e.target.value}))} placeholder="email@alqumra.ma" />
              </div>
              <div className="form-group">
                <label className="form-label">{ml.role}</label>
                <select className="form-input" value={staffForm.role} onChange={e=>setStaffForm(f=>({...f,role:e.target.value}))}>
                  <option>Staff</option><option>Manager</option><option>Admin</option>
                </select>
              </div>
              <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}} onClick={addStaff}>{ml.addStaff}</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}