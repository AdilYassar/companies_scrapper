import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Companies from './components/Companies';
import Scraping from './components/Scraping';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="container-fluid">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/scraping" element={<Scraping />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
