import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import CinemasPage from './pages/CinemasPage';
import CinemaDetailPage from './pages/CinemaDetailPage';
import SeatMapPage from './pages/SeatMapPage';
import CheckoutPage from './pages/CheckoutPage';
import BookingConfirmPage from './pages/BookingConfirmPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import FavoritesPage from './pages/FavoritesPage';
import ResellPage from './pages/ResellPage';
import FeedbackPage from './pages/FeedbackPage';
import StaffDashboard from './pages/StaffDashboard';
import QRScannerPage from './pages/QRScannerPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminMoviesPage from './pages/AdminMoviesPage';
import AdminHallsPage from './pages/AdminHallsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AIRecommendPage from './pages/AIRecommendPage';
import OffersPage from './pages/OffersPage';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"                    element={<HomePage />} />
          <Route path="/movies"              element={<MoviesPage />} />
          <Route path="/movies/:id"          element={<MovieDetailPage />} />
          <Route path="/cinemas"             element={<CinemasPage />} />
          <Route path="/cinemas/:id"         element={<CinemaDetailPage />} />
          <Route path="/seats/:sessionId"    element={<SeatMapPage />} />
          <Route path="/checkout"            element={<CheckoutPage />} />
          <Route path="/booking-confirm/:id" element={<BookingConfirmPage />} />
          <Route path="/profile"             element={<ProfilePage />} />
          <Route path="/history"             element={<BookingHistoryPage />} />
          <Route path="/favorites"           element={<FavoritesPage />} />
          <Route path="/resell"              element={<ResellPage />} />
          <Route path="/feedback"            element={<FeedbackPage />} />
          <Route path="/ai-recommend"        element={<AIRecommendPage />} />
          <Route path="/offers"              element={<OffersPage />} />
        </Route>

        {/* Auth — no main layout */}
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/register"       element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Staff — protected */}
        <Route path="/staff"        element={<ProtectedRoute requiredRole="staff"><StaffDashboard /></ProtectedRoute>} />
        <Route path="/staff/scanner" element={<ProtectedRoute requiredRole="staff"><QRScannerPage /></ProtectedRoute>} />

        {/* Admin — protected */}
        <Route path="/admin"         element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/movies"  element={<ProtectedRoute requiredRole="admin"><AdminMoviesPage /></ProtectedRoute>} />
        <Route path="/admin/halls"   element={<ProtectedRoute requiredRole="admin"><AdminHallsPage /></ProtectedRoute>} />
        <Route path="/admin/users"   element={<ProtectedRoute requiredRole="admin"><AdminUsersPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
