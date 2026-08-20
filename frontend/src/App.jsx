import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Home from './pages/Home';
import Detection from './pages/Detection';
import History from './pages/History';
import Statistics from './pages/Statistics';
import Reports from './pages/Reports';
import Complaint from './pages/Complaint';
import Feedback from './pages/Feedback';
import About from './pages/About';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detection" element={<Detection />} />
          <Route path="/history" element={<History />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/complaint" element={<Complaint />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
}
