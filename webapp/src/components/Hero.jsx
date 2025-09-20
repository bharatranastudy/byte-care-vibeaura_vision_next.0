// import React from 'react';
// import { motion } from 'framer-motion';
// import { FaRobot, FaHeartbeat, FaGlobe, FaShieldAlt, FaCoins, FaMicrophone } from 'react-icons/fa';
// import { Link } from 'react-router-dom';

// const Hero = () => {
//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
//       {/* Background Animation */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
//         <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//         <div className="text-center">
//           {/* Main Heading */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="mb-8"
//           >
//             <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
//               SIH Health Bot
//               <span className="text-6xl md:text-8xl ml-4">🏥🤖</span>
//             </h1>
//             <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
//               Your AI-powered healthcare companion providing multilingual support, 
//               symptom analysis, vaccination schedules, and blockchain rewards
//             </p>
//           </motion.div>

//           {/* Feature Icons */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             className="flex flex-wrap justify-center gap-8 mb-12"
//           >
//             <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
//               <FaGlobe className="text-blue-500 text-xl" />
//               <span className="text-gray-700 font-medium">6+ Languages</span>
//             </div>
//             <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
//               <FaHeartbeat className="text-red-500 text-xl" />
//               <span className="text-gray-700 font-medium">Health Analysis</span>
//             </div>
//             <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
//               <FaShieldAlt className="text-green-500 text-xl" />
//               <span className="text-gray-700 font-medium">Real-time Alerts</span>
//             </div>
//             <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
//               <FaCoins className="text-yellow-500 text-xl" />
//               <span className="text-gray-700 font-medium">Blockchain Rewards</span>
//             </div>
//           </motion.div>

//           {/* CTA Buttons */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//             className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
//           >
//             <Link
//               to="/dashboard"
//               className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
//             >
//               <FaRobot className="mr-2" />
//               Start Health Analysis
//             </Link>
//             <Link
//               to="/health-analysis"
//               className="inline-flex items-center px-8 py-4 bg-white text-gray-800 font-semibold rounded-full border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
//             >
//               <FaMicrophone className="mr-2" />
//               Voice Consultation
//             </Link>
//           </motion.div>

//           {/* Stats */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.6 }}
//             className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
//           >
//             <div className="text-center">
//               <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">80%+</div>
//               <div className="text-gray-600">Accuracy Rate</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">6+</div>
//               <div className="text-gray-600">Languages</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">24/7</div>
//               <div className="text-gray-600">Availability</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">1000+</div>
//               <div className="text-gray-600">Users Helped</div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Scroll Indicator */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1, delay: 1 }}
//         className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
//       >
//         <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
//           <div className="w-1 h-3 bg-gray-400 rounded-full animate-bounce mt-2"></div>
//         </div>
//       </motion.div>
//     </section>
//   );
// };

// export default Hero;


import React from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaHeartbeat, FaGlobe, FaShieldAlt, FaCoins, FaMicrophone } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-gradient-to-br from-purple-600/30 to-indigo-600/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-600/20 to-purple-600/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 container-1200 py-20 text-center">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
            <span className="gradient-text">ByteCare</span> — your AI health companion
            <span className="ml-2">🏥🤖</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Multilingual assistance, symptom analysis, vaccination schedules, outbreak alerts, and
            blockchain-based rewards for proactive health management.
          </p>
        </motion.div>

        {/* Feature Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {[
            { icon: <FaGlobe />, text: '6+ Languages', color: 'text-blue-500' },
            { icon: <FaHeartbeat />, text: 'Health Analysis', color: 'text-red-500' },
            { icon: <FaShieldAlt />, text: 'Real-time Alerts', color: 'text-green-500' },
            { icon: <FaCoins />, text: 'Blockchain Rewards', color: 'text-yellow-500' },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <div className={`${feature.color} text-xl`}>{feature.icon}</div>
              <span className="text-gray-200 font-medium">{feature.text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center btn-primary"
          >
            <FaRobot className="mr-2" /> Start Health Analysis
          </Link>
          <Link
            to="/health-analysis"
            className="inline-flex items-center btn-secondary"
          >
            <FaMicrophone className="mr-2" /> Voice Consultation
          </Link>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { value: '80%+', label: 'Accuracy Rate', color: 'text-indigo-400' },
            { value: '6+', label: 'Languages', color: 'text-green-400' },
            { value: '24/7', label: 'Availability', color: 'text-purple-400' },
            { value: '1000+', label: 'Users Helped', color: 'text-orange-400' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/40 rounded-full animate-bounce mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

