import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Courses from './components/Courses';
import WhyUs from './components/WhyUs';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import HealthAnalysis from './pages/HealthAnalysis';
import VaccinationSchedule from './pages/VaccinationSchedule';
import MedicineScanner from './pages/MedicineScanner';
import WalletPanel from './pages/WalletPanel';
import OutbreakAlerts from './pages/OutbreakAlerts';
import HealthQuiz from './pages/HealthQuiz';
import About from './pages/About';
import ClinicianDashboard from './pages/ClinicianDashboard';

// Context
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <HelmetProvider>
      <AppProvider>
        <Router>
          <div className="App min-h-screen bg-slate-900 text-white pt-16">
            <Navbar />
            
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Features />
                  <Courses />
                  <WhyUs />
                </>
              } />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/health-analysis" element={<HealthAnalysis />} />
              <Route path="/vaccination-schedule" element={<VaccinationSchedule />} />
              <Route path="/medicine-scanner" element={<MedicineScanner />} />
              <Route path="/wallet" element={<WalletPanel />} />
              <Route path="/outbreak-alerts" element={<OutbreakAlerts />} />
              <Route path="/health-quiz" element={<HealthQuiz />} />
              <Route path="/about" element={<About />} />
              <Route path="/clinician" element={<ClinicianDashboard />} />
            </Routes>
            
            <ChatWidget />
            <Footer />
            
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AppProvider>
    </HelmetProvider>
  );
}

export default App;
