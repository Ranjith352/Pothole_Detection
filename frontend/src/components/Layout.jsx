import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div
        style={{
          marginLeft: sidebarOpen ? '260px' : '80px',
          marginTop: '64px',
          minHeight: 'calc(100vh - 64px)',
          transition: 'margin-left 0.3s ease',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <main style={{ padding: '32px', flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
