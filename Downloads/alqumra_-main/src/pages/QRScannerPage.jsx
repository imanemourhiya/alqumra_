// Redirect stub — served inside StaffDashboard flow
import { Link } from 'react-router-dom';
export default function QRScannerPage() {
  return (
    <div style={{padding:'80px 24px',textAlign:'center',color:'var(--text-muted)'}}>
      <h2 style={{fontFamily:'Cinzel,serif',color:'var(--ivory)',marginBottom:16}}>QR Scanner</h2>
      <p>Use the Staff Portal for full scanner functionality.</p>
      <Link to="/staff" className="btn btn-primary" style={{marginTop:20}}>Go to Staff Portal</Link>
    </div>
  );
}
