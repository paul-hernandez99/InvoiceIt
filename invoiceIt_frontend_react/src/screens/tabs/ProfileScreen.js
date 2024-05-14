import React from 'react';
import { useAuth } from '../../AuthContext';

function ProfileScreen() {

    const { currentUser, logout } = useAuth();

    const handleLogout = () => {
        logout();
      };

    return (
    <div>
        <h1>Profile</h1>
        {currentUser ? (
        <div>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Name:</strong> {currentUser.name}</p>
            <p><strong>Surname:</strong> {currentUser.surname}</p>
            <p><strong>Birthday:</strong> {currentUser.birthday}</p>
            <div>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
        ) : (
        <p>No user data available</p>
        )}
    </div>
    );
}

export default ProfileScreen;