// src/App.jsx
import React from 'react';
import SignupForm from './components/SignupPage/SignupForm';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Bangladesh Citizen Portal</h1>
        <p>National Registration System</p>
      </header>
      <main>
        <SignupForm />
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} - Bangladesh Citizen Portal</p>
      </footer>
    </div>
  );
}

export default App;