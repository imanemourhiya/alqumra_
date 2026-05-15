import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AIChatWidget from './AIChatWidget';

export default function Layout() {
  const { pathname } = useLocation();
  const noFooter = ['/staff', '/admin'].some(p => pathname.startsWith(p));

  return (
    <div className="film-grain" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: '70px' }}>
        <Outlet />
      </main>
      {!noFooter && <Footer />}
      <AIChatWidget />
    </div>
  );
}

