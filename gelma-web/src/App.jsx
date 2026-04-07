import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Productos from './pages/Productos';
import Pedidos from './pages/Pedidos';
import Informes from './pages/Informes';
import './App.css';

function Navigation() {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/clientes', label: 'Clientes', icon: '👥' },
    { path: '/productos', label: 'Productos', icon: '📦' },
    { path: '/pedidos', label: 'Pedidos', icon: '🛒' },
    { path: '/informes', label: 'Informes', icon: '📈' },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h1>GELMA</h1>
        <p>Sistema de Comercialización</p>
      </div>
      <ul className="nav-menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link 
              to={item.path} 
              className={location.pathname === item.path ? 'active' : ''}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/informes" element={<Informes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
