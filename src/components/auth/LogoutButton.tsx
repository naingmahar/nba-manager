import React from 'react';
import { logout, resetAppState } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/store/hook'; // Import the typed hook
import { useStore } from 'react-redux';


/**
 * LogoutButton Component
 * Renders a button that, when clicked, dispatches the Redux 'logout' action,
 * clearing the authentication state.
 */
const LogoutButton: React.FC = () => {
  // Use the typed dispatch hook
  const dispatch = useAppDispatch();


  const handleLogout = async () => {
    // Dispatch the logout action (no API request required, as per constraints)
    dispatch(logout());
    dispatch(resetAppState());
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-2 bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition duration-150 shadow-md"
    >
      Logout
    </button>
  );
};

export default LogoutButton;