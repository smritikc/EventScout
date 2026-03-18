import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/profile`);
    return response.data.user;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}/users/profile`, profileData);
    toast.success('Profile updated successfully!');
    return response.data.user;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/users/change-password`, {
      currentPassword,
      newPassword
    });
    toast.success('Password changed successfully!');
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await axios.post(`${API_URL}/users/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    toast.success('Profile picture updated!');
    return response.data.imageUrl;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

// Get user stats
export const getUserStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/stats`);
    return response.data.stats;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};