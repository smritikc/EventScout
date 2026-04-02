import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import PrefQuiz from './pages/PrefQuiz';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Calendar from './pages/Calendar';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import OAuthSuccess from './pages/OAuthSuccess';
import Landing from './pages/Landing';
import OrganizerDashboard from './pages/OrganizerDashboard';
import OrganizerRegister from './pages/OrganizerRegister';
import './styles/global.css';

const queryClient = new QueryClient();

function App() {


  return (
    <QueryClientProvider client={queryClient}>
      <Router> {/* Router must be outside AuthProvider */}
        <AuthProvider> {/* AuthProvider now has access to Router context */}
          <div className="app-container">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'white',
                  color: '#1f2937',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                },
                success: {
                  icon: <CheckCircle size={20} color="#10b981" />,
                  style: {
                    borderLeft: '4px solid #10b981',
                  },
                },
                error: {
                  icon: <AlertCircle size={20} color="#ef4444" />,
                  style: {
                    borderLeft: '4px solid #ef4444',
                  },
                },
              }}
            />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pref-quiz" element={
                <PrivateRoute>
                  <PrefQuiz />
                </PrivateRoute>
              } />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/search" element={
                <PrivateRoute>
                  <Search />
                </PrivateRoute>
              } />
              <Route path="/calendar" element={
                <PrivateRoute>
                  <Calendar />
                </PrivateRoute>
              } />
              <Route path="/wishlist" element={
                <PrivateRoute>
                  <Wishlist />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/organizer-dashboard" element={
                <PrivateRoute>
                  <OrganizerDashboard />
                </PrivateRoute>
              } />
              <Route path="/organizer-register" element={<OrganizerRegister />} />
              <Route path="/oauth-success" element={<OAuthSuccess />} />
              <Route path="/" element={<Landing />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;