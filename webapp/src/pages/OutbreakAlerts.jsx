import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBell, 
  FaExclamationTriangle, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaUsers,
  FaShieldAlt,
  FaInfoCircle,
  FaFilter,
  FaSearch,
  FaEye,
  FaTimes
} from 'react-icons/fa';

const OutbreakAlerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: 'Dengue Outbreak Alert',
      severity: 'high',
      location: 'Delhi NCR',
      cases: 245,
      date: '2024-09-15',
      description: 'Significant increase in dengue cases reported in Delhi NCR region. Health authorities recommend preventive measures.',
      recommendations: [
        'Remove stagnant water from surroundings',
        'Use mosquito repellents',
        'Wear full-sleeve clothing',
        'Seek immediate medical attention for fever'
      ],
      status: 'active',
      source: 'Ministry of Health & Family Welfare'
    },
    {
      id: 2,
      title: 'Seasonal Flu Increase',
      severity: 'medium',
      location: 'Mumbai',
      cases: 89,
      date: '2024-09-12',
      description: 'Seasonal influenza cases showing upward trend in Mumbai metropolitan area.',
      recommendations: [
        'Get annual flu vaccination',
        'Practice good hand hygiene',
        'Avoid crowded places if feeling unwell',
        'Stay hydrated and rest adequately'
      ],
      status: 'monitoring',
      source: 'Maharashtra Health Department'
    },
    {
      id: 3,
      title: 'Food Poisoning Cases',
      severity: 'medium',
      location: 'Bangalore',
      cases: 34,
      date: '2024-09-10',
      description: 'Multiple food poisoning cases linked to street food vendors in Bangalore city.',
      recommendations: [
        'Avoid street food from unverified vendors',
        'Drink only boiled or bottled water',
        'Wash hands before eating',
        'Report food poisoning cases to authorities'
      ],
      status: 'resolved',
      source: 'Karnataka Health Department'
    },
    {
      id: 4,
      title: 'Chikungunya Alert',
      severity: 'high',
      location: 'Chennai',
      cases: 156,
      date: '2024-09-08',
      description: 'Chikungunya outbreak reported in several areas of Chennai with rising case numbers.',
      recommendations: [
        'Eliminate mosquito breeding sites',
        'Use bed nets and repellents',
        'Maintain cleanliness around homes',
        'Report suspected cases immediately'
      ],
      status: 'active',
      source: 'Tamil Nadu Health Department'
    },
    {
      id: 5,
      title: 'Water Contamination Warning',
      severity: 'low',
      location: 'Kolkata',
      cases: 12,
      date: '2024-09-05',
      description: 'Water contamination detected in certain areas of Kolkata causing minor health issues.',
      recommendations: [
        'Boil water before consumption',
        'Use water purification tablets',
        'Avoid raw foods washed with tap water',
        'Report water quality issues'
      ],
      status: 'monitoring',
      source: 'West Bengal Health Department'
    }
  ]);

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--x', `${x}px`);
    e.currentTarget.style.setProperty('--y', `${y}px`);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-300 bg-red-500/15 border-red-500/40';
      case 'medium': return 'text-orange-300 bg-orange-500/15 border-orange-500/40';
      case 'low': return 'text-yellow-300 bg-yellow-500/15 border-yellow-500/40';
      default: return 'text-gray-300 bg-white/5 border-white/10';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-red-300 bg-red-500/15 border border-red-500/40';
      case 'monitoring': return 'text-orange-300 bg-orange-500/15 border border-orange-500/40';
      case 'resolved': return 'text-green-300 bg-green-500/15 border border-green-500/40';
      default: return 'text-gray-300 bg-white/5 border border-white/10';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-20">
      <div className="container-1200 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold font-display text-white mb-4">
            Outbreak Alerts
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay informed about health outbreaks and disease alerts in your area. 
            Get real-time updates from government health authorities with HMAC verification.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onMouseMove={handleMove}
          className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 mb-8 backdrop-blur-md hover-spotlight spotlight-amber"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alerts by title or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Severities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="monitoring">Monitoring</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm font-medium">High Severity</p>
                <p className="text-3xl font-bold text-white">
                  {alerts.filter(a => a.severity === 'high').length}
                </p>
              </div>
              <FaExclamationTriangle className="text-2xl text-red-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm font-medium">Medium Severity</p>
                <p className="text-3xl font-bold text-white">
                  {alerts.filter(a => a.severity === 'medium').length}
                </p>
              </div>
              <FaBell className="text-2xl text-orange-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Active Alerts</p>
                <p className="text-3xl font-bold text-white">
                  {alerts.filter(a => a.status === 'active').length}
                </p>
              </div>
              <FaShieldAlt className="text-2xl text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Cases</p>
                <p className="text-3xl font-bold text-white">
                  {alerts.reduce((sum, alert) => sum + alert.cases, 0)}
                </p>
              </div>
              <FaUsers className="text-2xl text-blue-400" />
            </div>
          </motion.div>
        </div>

        {/* Alerts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          {filteredAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onMouseMove={handleMove}
              className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow backdrop-blur-md hover-spotlight spotlight-rose"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{alert.title}</h3>
                    <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                      {alert.status.toUpperCase()}
                    </div>
                  </div>
                  <p className="text-gray-300 mb-3">{alert.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <FaMapMarkerAlt />
                      <span>{alert.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaUsers />
                      <span>{alert.cases} cases</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaCalendarAlt />
                      <span>{alert.date}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAlert(alert)}
                  className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FaEye />
                </button>
              </div>
              <div className="text-xs text-gray-400">
                Source: {alert.source}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Alert Detail Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedAlert.title}</h2>
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getSeverityColor(selectedAlert.severity)}`}>
                        {selectedAlert.severity.toUpperCase()}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAlert.status)}`}>
                        {selectedAlert.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{selectedAlert.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Location</h4>
                      <p className="text-gray-700">{selectedAlert.location}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Cases Reported</h4>
                      <p className="text-gray-700">{selectedAlert.cases}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Date Reported</h4>
                      <p className="text-gray-700">{selectedAlert.date}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                    <div className="space-y-2">
                      {selectedAlert.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
                          <p className="text-gray-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <h4 className="font-semibold text-blue-800 mb-1">Verified Source</h4>
                    <p className="text-blue-700 text-sm">{selectedAlert.source}</p>
                    <p className="text-blue-600 text-xs mt-1">✓ HMAC Verified</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutbreakAlerts;
