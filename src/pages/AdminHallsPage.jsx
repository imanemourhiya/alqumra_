import { Link } from 'react-router-dom';
export default function AdminHallsPage() {
  return <div style={{padding:'40px 24px',color:'var(--text-muted)'}}><h2 style={{fontFamily:'Cinzel,serif',color:'var(--ivory)',marginBottom:16}}>Manage Halls</h2><Link to="/admin" className="btn btn-outline">Back to Admin</Link></div>;
}
