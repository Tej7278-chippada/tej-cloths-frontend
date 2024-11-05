// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Admin from './components/Admin';
import ProductList from './components/ProductList';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Tej-Cloths
          </Typography>
          <Link to="/admin" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Admin Page</Link>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Products Page</Link>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
