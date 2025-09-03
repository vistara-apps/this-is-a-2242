import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { User, Mail, Building, Briefcase, Save, AlertCircle, Lock } from 'lucide-react';
import { getFullName } from '../models/User';

/**
 * UserProfile Component
 * 
 * This component displays and allows editing of the user's profile information.
 * It handles form submission, validation, and error display.
 */
const UserProfile = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { success, error: showError } = useNotification();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  // Profile form data
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    department: user?.department || '',
    position: user?.position || ''
  });
  
  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  /**
   * Handle profile form input change
   * @param {Event} e - Input change event
   */
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  /**
   * Handle password form input change
   * @param {Event} e - Input change event
   */
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  /**
   * Handle profile form submission
   * @param {Event} e - Form submit event
   */
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!profileData.firstName || !profileData.lastName) {
      setFormError('First name and last name are required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setFormError('');
      
      // Update profile
      await updateProfile(profileData);
      
      // Show success notification
      success('Profile updated successfully');
      
      // Exit edit mode
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
      
      // Set form error
      setFormError(err.message || 'Failed to update profile. Please try again.');
      
      // Show error notification
      showError('Profile update failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * Handle password form submission
   * @param {Event} e - Form submit event
   */
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setFormError('All password fields are required');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFormError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setFormError('New password must be at least 8 characters long');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setFormError('');
      
      // Change password
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      // Show success notification
      success('Password changed successfully');
      
      // Reset form and exit password change mode
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsChangingPassword(false);
    } catch (err) {
      console.error('Password change error:', err);
      
      // Set form error
      setFormError(err.message || 'Failed to change password. Please try again.');
      
      // Show error notification
      showError('Password change failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * Handle logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      showError('Logout failed. Please try again.');
    }
  };
  
  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <p className="text-steel-600">Please log in to view your profile</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-steel-700 to-steel-800">
        <h2 className="text-lg font-semibold text-white">User Profile</h2>
      </div>
      
      <div className="p-6">
        {formError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          </div>
        )}
        
        {/* Profile Information */}
        {!isEditing && !isChangingPassword && (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-steel-900">{getFullName(user)}</h3>
              <p className="text-steel-600">{user.email}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-steel-50 p-4 rounded-lg">
                <div className="flex items-center text-steel-700 mb-1">
                  <Building className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Department</span>
                </div>
                <p className="text-steel-900">{user.department || 'Not specified'}</p>
              </div>
              
              <div className="bg-steel-50 p-4 rounded-lg">
                <div className="flex items-center text-steel-700 mb-1">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Position</span>
                </div>
                <p className="text-steel-900">{user.position || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center"
              >
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
              
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex-1 bg-steel-200 text-steel-700 py-2 px-4 rounded-lg hover:bg-steel-300 transition-colors duration-200 font-medium flex items-center justify-center"
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </button>
              
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium flex items-center justify-center"
              >
                Logout
              </button>
            </div>
          </div>
        )}
        
        {/* Edit Profile Form */}
        {isEditing && (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-steel-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-steel-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-steel-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={user.email}
                className="w-full px-3 py-2 border border-steel-300 rounded-lg bg-steel-50 text-steel-500"
                disabled
              />
              <p className="text-xs text-steel-500 mt-1">Email cannot be changed</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-steel-700 mb-2">
                  <Building className="w-4 h-4 inline mr-1" />
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={profileData.department}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-steel-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={profileData.position}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormError('');
                  setProfileData({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    department: user.department || '',
                    position: user.position || ''
                  });
                }}
                className="flex-1 bg-steel-200 text-steel-700 py-2 px-4 rounded-lg hover:bg-steel-300 transition-colors duration-200 font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        
        {/* Change Password Form */}
        {isChangingPassword && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-steel-700 mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-steel-700 mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-steel-500 mt-1">
                Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-steel-700 mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Changing...' : 'Change Password'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setFormError('');
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                className="flex-1 bg-steel-200 text-steel-700 py-2 px-4 rounded-lg hover:bg-steel-300 transition-colors duration-200 font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

