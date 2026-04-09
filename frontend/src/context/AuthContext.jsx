import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Create context
const AuthContext = createContext();

// Custom hook - this is fine, it's not a component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component - this is the component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // Set axios default header
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`);
      setUser(response.data.user);
    } catch {
      localStorage.removeItem('token');
      setToken(null);
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      setUser(user);
      
      toast.success(`Welcome back!`);
      
      return { success: true, user };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  }, []); // removed navigate dependency since it's handled in pages

  const register = useCallback(async (name, email, password, phone) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name,
        email,
        password,
        phone
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      setUser(user);
      
      toast.success('Account created successfully!');
      return { success: true, user };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message };
    }
  }, []);

  const becomeOrganizer = useCallback(async (formData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/organizers/verify-otp`, formData);
      
      const { token, user: updatedUser } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      setUser(prev => ({ ...prev, ...updatedUser }));
      
      toast.success('You are now an Organizer!');
      return { success: true, user: updatedUser };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
      return { success: false };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  }, [navigate]);

  const updatePreferences = useCallback(async (preferences) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/users/preferences`, {
        preferences
      });
      setUser(prev => ({ ...prev, ...response.data.user }));
      toast.success('Preferences updated!');
      return { success: true };
    } catch {
      toast.error('Failed to update preferences');
      return { success: false };
    }
  }, []);

  const loginWithToken = useCallback(async (newToken) => {
    try {
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setToken(newToken);
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`);
      setUser(response.data.user);
      
      toast.success('Welcome back!');
      // navigate('/dashboard');
      return { success: true, user: response.data.user };
    } catch {
      localStorage.removeItem('token');
      setToken(null);
      delete axios.defaults.headers.common['Authorization'];
      toast.error('Authentication failed');
      navigate('/login');
      return { success: false };
    }
  }, [navigate]);

  const updateRole = useCallback(async (role) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/users/role`, {
        role
      });
      setUser(prev => ({ ...prev, role: response.data.user.role }));
      toast.success(`Switched to ${role} role!`);
      return { success: true };
    } catch {
      toast.error('Failed to update role');
      return { success: false };
    }
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    becomeOrganizer,
    logout,
    updatePreferences,
    loginWithToken,
    updateRole,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Default export for the provider (optional, but helps with fast refresh)
export default AuthProvider;