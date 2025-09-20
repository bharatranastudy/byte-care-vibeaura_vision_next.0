import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSyringe, 
  FaCalendarAlt, 
  FaBaby, 
  FaChild, 
  FaUser, 
  FaUserTie,
  FaBell,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaPlus,
  FaEdit,
  FaTrash
} from 'react-icons/fa';

const VaccinationSchedule = () => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [vaccinations, setVaccinations] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--x', `${x}px`);
    e.currentTarget.style.setProperty('--y', `${y}px`);
  };

  const ageGroups = [
    { id: 'infant', label: 'Infant (0-2 years)', icon: <FaBaby /> },
    { id: 'child', label: 'Child (2-18 years)', icon: <FaChild /> },
    { id: 'adult', label: 'Adult (18-65 years)', icon: <FaUser /> },
    { id: 'senior', label: 'Senior (65+ years)', icon: <FaUserTie /> }
  ];

  const vaccineSchedules = {
    infant: [
      { name: 'BCG', age: 'At birth', status: 'completed', dueDate: '2024-01-15', description: 'Tuberculosis prevention' },
      { name: 'Hepatitis B', age: 'At birth, 6 weeks, 14 weeks', status: 'completed', dueDate: '2024-02-15', description: 'Hepatitis B prevention' },
      { name: 'DPT', age: '6, 10, 14 weeks', status: 'pending', dueDate: '2024-12-15', description: 'Diphtheria, Pertussis, Tetanus' },
      { name: 'Polio (OPV)', age: '6, 10, 14 weeks', status: 'pending', dueDate: '2024-12-20', description: 'Polio prevention' },
      { name: 'MMR', age: '9-12 months', status: 'upcoming', dueDate: '2025-01-10', description: 'Measles, Mumps, Rubella' }
    ],
    child: [
      { name: 'DPT Booster', age: '16-24 months', status: 'completed', dueDate: '2024-03-15', description: 'Booster dose' },
      { name: 'MMR 2nd Dose', age: '16-24 months', status: 'completed', dueDate: '2024-03-20', description: 'Second MMR dose' },
      { name: 'Typhoid', age: '2 years', status: 'pending', dueDate: '2024-12-25', description: 'Typhoid fever prevention' },
      { name: 'Hepatitis A', age: '2-18 years', status: 'upcoming', dueDate: '2025-02-01', description: 'Hepatitis A prevention' },
      { name: 'HPV', age: '9-14 years', status: 'upcoming', dueDate: '2025-03-01', description: 'Human Papillomavirus' }
    ],
    adult: [
      { name: 'COVID-19', age: 'Annual', status: 'completed', dueDate: '2024-09-15', description: 'Coronavirus prevention' },
      { name: 'Influenza', age: 'Annual', status: 'pending', dueDate: '2024-11-01', description: 'Seasonal flu prevention' },
      { name: 'Tetanus', age: 'Every 10 years', status: 'upcoming', dueDate: '2025-01-15', description: 'Tetanus prevention' },
      { name: 'Hepatitis B', age: 'If not vaccinated', status: 'completed', dueDate: '2024-06-15', description: 'Hepatitis B prevention' },
      { name: 'Pneumococcal', age: 'High risk groups', status: 'upcoming', dueDate: '2025-02-15', description: 'Pneumonia prevention' }
    ],
    senior: [
      { name: 'Influenza', age: 'Annual', status: 'pending', dueDate: '2024-10-15', description: 'Seasonal flu prevention' },
      { name: 'Pneumococcal', age: 'Once after 65', status: 'completed', dueDate: '2024-05-15', description: 'Pneumonia prevention' },
      { name: 'Shingles (Zoster)', age: '60+ years', status: 'upcoming', dueDate: '2025-01-20', description: 'Shingles prevention' },
      { name: 'COVID-19', age: 'Annual', status: 'completed', dueDate: '2024-08-15', description: 'Coronavirus prevention' },
      { name: 'Tdap', age: 'Every 10 years', status: 'upcoming', dueDate: '2025-03-15', description: 'Tetanus, Diphtheria, Pertussis' }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-300 bg-green-500/15 border-green-500/40';
      case 'pending': return 'text-orange-300 bg-orange-500/15 border-orange-500/40';
      case 'upcoming': return 'text-blue-300 bg-blue-500/15 border-blue-500/40';
      case 'overdue': return 'text-red-300 bg-red-500/15 border-red-500/40';
      default: return 'text-gray-300 bg-white/5 border-white/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle />;
      case 'pending': return <FaClock />;
      case 'upcoming': return <FaBell />;
      case 'overdue': return <FaExclamationTriangle />;
      default: return <FaClock />;
    }
  };

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
            Vaccination Schedule
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay up-to-date with your vaccinations. Track your immunization history 
            and get reminders for upcoming vaccines based on your age group.
          </p>
        </motion.div>

        {/* Age Group Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 mb-8 backdrop-blur-md"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Select Age Group</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {ageGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedAgeGroup(group.id)}
                onMouseMove={handleMove}
                className={`group p-4 rounded-xl transition-all duration-200 flex flex-col items-center space-y-3 hover-spotlight spotlight-indigo ${
                  selectedAgeGroup === group.id
                    ? 'bg-blue-500/20 ring-1 ring-blue-400/40 text-white'
                    : 'bg-white/5 text-gray-200 hover:bg-blue-500/10'
                }`}
              >
                <div className="text-3xl">{group.icon}</div>
                <span className="font-medium text-center">{group.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vaccination List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/5 rounded-2xl shadow-xl p-6 backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {selectedAgeGroup ? `${ageGroups.find(g => g.id === selectedAgeGroup)?.label} Vaccines` : 'Select an age group'}
                </h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <FaPlus />
                  <span>Add Custom</span>
                </button>
              </div>

              {!selectedAgeGroup ? (
                <div className="text-gray-400 text-center py-10">Choose an age group to view recommended vaccines.</div>
              ) : (
                <div className="space-y-4">
                {vaccineSchedules[selectedAgeGroup]?.map((vaccine, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onMouseMove={handleMove}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:shadow-2xl transition-shadow hover-spotlight spotlight-emerald backdrop-blur-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <FaSyringe className="text-blue-500" />
                          <h3 className="text-lg font-semibold text-white">{vaccine.name}</h3>
                          <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center space-x-1 ${getStatusColor(vaccine.status)}`}>
                            {getStatusIcon(vaccine.status)}
                            <span className="capitalize">{vaccine.status}</span>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-2">{vaccine.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Age: {vaccine.age}</span>
                          <span>Due: {vaccine.dueDate}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                          <FaEdit />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onMouseMove={handleMove}
              className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 hover:shadow-2xl backdrop-blur-md hover-spotlight spotlight-emerald"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Vaccination Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Completed</span>
                  <span className="font-bold text-green-400">
                    {vaccineSchedules[selectedAgeGroup]?.filter(v => v.status === 'completed').length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Pending</span>
                  <span className="font-bold text-orange-400">
                    {vaccineSchedules[selectedAgeGroup]?.filter(v => v.status === 'pending').length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Upcoming</span>
                  <span className="font-bold text-blue-400">
                    {vaccineSchedules[selectedAgeGroup]?.filter(v => v.status === 'upcoming').length || 0}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Reminders */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onMouseMove={handleMove}
              className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 hover:shadow-2xl backdrop-blur-md hover-spotlight spotlight-amber"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Upcoming Reminders</h3>
              <div className="space-y-3">
                {vaccineSchedules[selectedAgeGroup]
                  ?.filter(v => v.status === 'pending' || v.status === 'upcoming')
                  .slice(0, 3)
                  .map((vaccine, index) => (
                    <div key={index} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                      <h4 className="font-medium text-white">{vaccine.name}</h4>
                      <p className="text-sm text-gray-300">Due: {vaccine.dueDate}</p>
                    </div>
                  ))}
              </div>
              <button className="w-full mt-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                Set Reminders
              </button>
            </motion.div>

            {/* Health Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              onMouseMove={handleMove}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:shadow-2xl backdrop-blur-md hover-spotlight spotlight-indigo"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Vaccination Tips</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Keep your vaccination records updated</li>
                <li>• Consult your doctor before traveling</li>
                <li>• Report any adverse reactions</li>
                <li>• Stay informed about new vaccines</li>
                <li>• Maintain herd immunity by vaccinating</li>
              </ul>
            </motion.div>

            {/* Emergency Contacts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              onMouseMove={handleMove}
              className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 hover:shadow-2xl backdrop-blur-md hover-spotlight spotlight-rose"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Emergency Contacts</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Health Helpline:</span>
                  <span className="font-medium text-white">1075</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Poison Control:</span>
                  <span className="font-medium text-white">1066</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Emergency:</span>
                  <span className="font-medium text-white">108</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationSchedule;
