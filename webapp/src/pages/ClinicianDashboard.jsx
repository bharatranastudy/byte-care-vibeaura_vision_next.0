import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserMd, FaHeartbeat, FaExclamationTriangle, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const ClinicianDashboard = () => {
  const [reports, setReports] = useState([
    { id: 1, ts: '2025-09-18', symptom: 'Fever', severity: 'moderate', duration: '3 days' },
    { id: 2, ts: '2025-09-19', symptom: 'Cough', severity: 'mild', duration: '1 week' },
    { id: 3, ts: '2025-09-19', symptom: 'Headache', severity: 'moderate', duration: '2 days' },
  ]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/outbreaks');
        const data = await res.json();
        setAlerts(data.alerts || []);
      } catch (_) {}
    };
    fetchAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-20">
      <div className="container-1200 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold font-display">Clinician Dashboard</h1>
          <p className="text-gray-300 mt-2">De‑identified symptom reports and local health alerts.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 backdrop-blur-md hover-spotlight spotlight-indigo"
          >
            <div className="flex items-center space-x-3 mb-4">
              <FaUserMd className="text-2xl text-blue-400" />
              <h2 className="text-2xl font-semibold">Recent Symptom Reports</h2>
            </div>
            <div className="space-y-3">
              {reports.map(r => (
                <div key={r.id} className="p-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{r.symptom}</div>
                    <div className="text-sm text-gray-400">Severity: {r.severity} • Duration: {r.duration}</div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <FaCalendarAlt />
                    <span className="text-sm">{r.ts}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 backdrop-blur-md hover-spotlight spotlight-rose"
          >
            <div className="flex items-center space-x-3 mb-4">
              <FaExclamationTriangle className="text-2xl text-red-400" />
              <h2 className="text-2xl font-semibold">Local Outbreak Alerts</h2>
            </div>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="text-gray-400">No alerts found.</div>
              ) : (
                alerts.map((a, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-white">{a.title}</div>
                      <span className="text-xs px-2 py-1 rounded-full border border-red-500/40 text-red-300">{a.severity}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1"><FaMapMarkerAlt /><span>{a.location}</span></div>
                      <div className="flex items-center space-x-1"><FaCalendarAlt /><span>{a.date}</span></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md text-center">
            <FaHeartbeat className="text-3xl text-emerald-400 mx-auto mb-2" />
            <div className="text-white font-bold text-xl">Triage Queue</div>
            <div className="text-gray-400">{reports.length} active cases</div>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md text-center">
            <FaUserMd className="text-3xl text-blue-400 mx-auto mb-2" />
            <div className="text-white font-bold text-xl">On-duty Clinicians</div>
            <div className="text-gray-400">2 online</div>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md text-center">
            <FaExclamationTriangle className="text-3xl text-red-400 mx-auto mb-2" />
            <div className="text-white font-bold text-xl">Active Alerts</div>
            <div className="text-gray-400">{alerts.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicianDashboard;
