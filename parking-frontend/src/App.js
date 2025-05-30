import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Simple components to test
const Home = () => (
  <div className="container mt-4">
    <h1>Smart Office - Parking Management System</h1>
    <p>Welcome to the parking management system!</p>
  </div>
);

const ParkingDashboard = () => (
  <div className="container mt-4">
    <h2>Parking Dashboard</h2>
    <p>This is the parking dashboard page.</p>
  </div>
);

const AddParking = () => (
  <div className="container mt-4">
    <h2>Add Parking</h2>
    <p>This is the add parking page.</p>
  </div>
);

const Reports = () => (
  <div className="container mt-4">
    <h2>Reports</h2>
    <p>This is the reports page.</p>
  </div>
);

// Simple Navigation
const Navigation = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container">
      <a className="navbar-brand" href="/">Parking System</a>
      <div className="navbar-nav">
        <a className="nav-link" href="/">Home</a>
        <a className="nav-link" href="/parking">Parking</a>
        <a className="nav-link" href="/add-parking">Add Parking</a>
        <a className="nav-link" href="/reports">Reports</a>
      </div>
    </div>
  </nav>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/parking" element={<ParkingDashboard />} />
          <Route path="/add-parking" element={<AddParking />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;