import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHeartbeat, 
  FaCalendarAlt, 
  FaCoins, 
  FaBell, 
  FaChartLine,
  FaUserMd,
  FaPills,
  FaCamera,
  FaQrcode,
  FaLanguage,
  FaShieldAlt,
  FaAward
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Dashboard = () => {
  const { user, healthData, wallet, notifications } = useApp();
  const [healthScore, setHealthScore] = useState(85);
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'symptom', text: 'Symptom check completed', time: '2 hours ago' },
    { id: 2, type: 'vaccine', text: 'Vaccination reminder set', time: '1 day ago' },
    { id: 3, type: 'reward', text: 'Earned 50 health tokens', time: '2 days ago' }
  ]);

  const quickActions = [
    {
      title: 'Health Analysis',
      icon: <FaHeartbeat className="text-2xl text-red-500" />,
      description: 'Check symptoms and get AI analysis',
      link: '/health-analysis',
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Medicine Scanner',
      icon: <FaQrcode className="text-2xl text-blue-500" />,
      description: 'Scan medicine packages for info',
      link: '/medicine-scanner',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Vaccination Schedule',
      icon: <FaCalendarAlt className="text-2xl text-green-500" />,
      description: 'View and manage vaccinations',
      link: '/vaccination-schedule',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Health Quiz',
      icon: <FaAward className="text-2xl text-purple-500" />,
      description: 'Take quiz and earn rewards',
      link: '/health-quiz',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const healthMetrics = [
    { label: 'Health Score', value: healthScore, unit: '/100', color: 'text-green-500' },
    { label: 'Symptoms Tracked', value: healthData.symptoms.length, unit: '', color: 'text-blue-500' },
    { label: 'Medications', value: healthData.medications.length, unit: '', color: 'text-orange-500' },
    { label: 'Appointments', value: healthData.appointments.length, unit: '', color: 'text-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-20">
      <div className="container-1200 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-extrabold tracking-tight font-display mb-2">
            <span className="gradient-text">Health Dashboard</span>
          </h1>
          <p className="text-gray-300">Welcome back! Here's your health overview and quick actions.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {healthMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">{metric.label}</p>
                  <p className={`text-3xl font-bold ${metric.color}`}>
                    {metric.value}{metric.unit}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <FaChartLine className={`text-xl ${metric.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 mb-8"
            >
              <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="group block"
                  >
                    <motion.div
                      whileHover={{ y: -2, scale: 1.02 }}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        e.currentTarget.style.setProperty('--x', `${x}px`);
                        e.currentTarget.style.setProperty('--y', `${y}px`);
                      }}
                      className={`p-6 border border-white/10 rounded-2xl bg-white/5 hover:border-white/20 hover:shadow-glow transition-all duration-300 relative overflow-hidden hover-spotlight ${
                        action.color.includes('green') ? 'spotlight-emerald' :
                        action.color.includes('blue') ? 'spotlight-indigo' :
                        action.color.includes('purple') ? 'spotlight-purple' :
                        action.color.includes('cyan') ? 'spotlight-cyan' :
                        action.color.includes('orange') || action.color.includes('yellow') ? 'spotlight-amber' :
                        'spotlight-indigo'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-4 mb-3">
                          {action.icon}
                          <h3 className="text-lg font-semibold">{action.title}</h3>
                        </div>
                        <p className="text-gray-300 text-sm">{action.description}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Health Insights */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-2xl font-bold mb-6">Health Insights</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaShieldAlt className="text-green-400 text-xl" />
                    <div>
                      <h4 className="font-semibold">Great Health Score!</h4>
                      <p className="text-sm text-gray-300">Your health metrics are looking good</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-400">{healthScore}/100</div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-blue-400 text-xl" />
                    <div>
                      <h4 className="font-semibold">Upcoming Checkup</h4>
                      <p className="text-sm text-gray-300">Annual health checkup due next month</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 btn-primary text-sm">
                    Schedule
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaPills className="text-yellow-400 text-xl" />
                    <div>
                      <h4 className="font-semibold">Medication Reminder</h4>
                      <p className="text-sm text-gray-300">Don't forget your evening vitamins</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 btn-secondary text-sm">
                    Set Reminder
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Health Wallet</h3>
                <FaCoins className="text-2xl text-yellow-300" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-100">Balance:</span>
                  <span className="font-bold">{wallet.balance} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-100">Health Tokens:</span>
                  <span className="font-bold">{wallet.tokens} HT</span>
                </div>
              </div>
              <Link
                to="/wallet"
                className="block w-full mt-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-center transition-colors"
              >
                View Wallet
              </Link>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      <FaHeartbeat className="text-blue-400 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.text}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Alerts</h3>
                <FaBell className="text-orange-400" />
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-red-500/10 border-l-4 border-red-500 rounded">
                  <p className="text-sm font-medium text-red-300">Outbreak Alert</p>
                  <p className="text-xs text-red-400">Flu cases increasing in your area</p>
                </div>
                <div className="p-3 bg-green-500/10 border-l-4 border-green-500 rounded">
                  <p className="text-sm font-medium text-green-300">Vaccination Due</p>
                  <p className="text-xs text-green-400">Annual flu shot recommended</p>
                </div>
              </div>
              <Link
                to="/outbreak-alerts"
                className="block w-full mt-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-center text-sm transition-colors"
              >
                View All Alerts
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
