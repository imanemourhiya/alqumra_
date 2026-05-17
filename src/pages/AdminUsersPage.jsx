import { Link } from 'react-router-dom';
export default function AdminUsersPage() {
  return <div style={{padding:'40px 24px',color:'var(--text-muted)'}}><h2 style={{fontFamily:'Cinzel,serif',color:'var(--ivory)',marginBottom:16}}>Manage Users</h2><Link to="/admin" className="btn btn-outline">Back to Admin</Link></div>;
}
