// Import necessary libraries
import './App.css';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, signOutUser } from './firebaseConfig';
import MapComponent from './components/MapComponent';

function App() {
  const [user, setUser] = useState(null);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <header className="header">
        <div className="logo-container">
          <img src="./logo.png" alt="Logo" className="logo" />
          <span className="app-name">Commute Companion</span>
        </div>
        <div className="auth-container">
          {user ? (
            <div className="user-info">
              <img src={user.photoURL} alt="User Avatar" className="user-avatar" />
              <span className="welcome-text">Welcome, {user.displayName}</span>
              <button onClick={signOutUser} className="auth-button">Sign Out</button>
            </div>
          ) : (
            <button onClick={signInWithGoogle} className="auth-button">Sign In with Google</button>
          )}
        </div>
      </header>
      <MapComponent />
    </div>
  );
}

export default App;