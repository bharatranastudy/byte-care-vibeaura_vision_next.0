// import React from 'react';
// import { motion } from 'framer-motion';
// import { 
//   FaRobot, 
//   FaLanguage, 
//   FaDatabase, 
//   FaBell, 
//   FaCoins, 
//   FaMicrophone, 
//   FaCamera, 
//   FaQrcode,
//   FaHeartbeat,
//   FaShieldAlt,
//   FaUserMd,
//   FaMobile
// } from 'react-icons/fa';

// const Features = () => {
//   const features = [
//     {
//       icon: <FaLanguage className="text-4xl text-blue-500" />,
//       title: "Multilingual Support",
//       description: "Communicate in 6+ languages including English, Hindi, Marathi, Bengali, Tamil, and Telugu",
//       color: "from-blue-500 to-cyan-500"
//     },
//     {
//       icon: <FaHeartbeat className="text-4xl text-red-500" />,
//       title: "Symptom Analysis",
//       description: "AI-powered symptom checker with 80%+ accuracy for preliminary health assessment",
//       color: "from-red-500 to-pink-500"
//     },
//     {
//       icon: <FaDatabase className="text-4xl text-green-500" />,
//       title: "Government Integration",
//       description: "Connected to MoHFW and IDSP databases for authentic health information",
//       color: "from-green-500 to-emerald-500"
//     },
//     {
//       icon: <FaBell className="text-4xl text-orange-500" />,
//       title: "Real-time Alerts",
//       description: "Outbreak notifications with HMAC verification for security and authenticity",
//       color: "from-orange-500 to-yellow-500"
//     },
//     {
//       icon: <FaCoins className="text-4xl text-purple-500" />,
//       title: "Blockchain Rewards",
//       description: "Earn tokens for health engagement and preventive care activities",
//       color: "from-purple-500 to-indigo-500"
//     },
//     {
//       icon: <FaMicrophone className="text-4xl text-indigo-500" />,
//       title: "Voice Input",
//       description: "Speak your symptoms and concerns using advanced speech recognition",
//       color: "from-indigo-500 to-blue-500"
//     },
//     {
//       icon: <FaCamera className="text-4xl text-pink-500" />,
//       title: "Image Analysis",
//       description: "Upload photos of symptoms, rashes, or medical documents for analysis",
//       color: "from-pink-500 to-rose-500"
//     },
//     {
//       icon: <FaQrcode className="text-4xl text-teal-500" />,
//       title: "Medicine Scanner",
//       description: "OCR-based medicine information extraction from packaging and prescriptions",
//       color: "from-teal-500 to-cyan-500"
//     },
//     {
//       icon: <FaUserMd className="text-4xl text-emerald-500" />,
//       title: "Clinician Dashboard",
//       description: "Professional interface for healthcare providers to monitor and assist patients",
//       color: "from-emerald-500 to-green-500"
//     },
//     {
//       icon: <FaMobile className="text-4xl text-violet-500" />,
//       title: "WhatsApp Integration",
//       description: "Access health services directly through WhatsApp and SMS messaging",
//       color: "from-violet-500 to-purple-500"
//     },
//     {
//       icon: <FaShieldAlt className="text-4xl text-amber-500" />,
//       title: "Vaccination Tracker",
//       description: "Personalized vaccination schedules and reminders for all age groups",
//       color: "from-amber-500 to-orange-500"
//     },
//     {
//       icon: <FaRobot className="text-4xl text-slate-500" />,
//       title: "AI Chatbot",
//       description: "24/7 intelligent conversational AI trained on medical knowledge base",
//       color: "from-slate-500 to-gray-500"
//     }
//   ];

//   return (
//     <section className="py-20 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Section Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//           className="text-center mb-16"
//         >
//           <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
//             Comprehensive Healthcare Features
//           </h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Powered by cutting-edge AI technology and integrated with government health systems 
//             to provide you with the most accurate and reliable healthcare assistance
//           </p>
//         </motion.div>

//         {/* Features Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {features.map((feature, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: index * 0.1 }}
//               viewport={{ once: true }}
//               whileHover={{ y: -5, scale: 1.02 }}
//               className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
//             >
//               {/* Gradient Background */}
//               <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              
//               {/* Icon */}
//               <div className="relative z-10 mb-6">
//                 <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                   {feature.icon}
//                 </div>
//               </div>

//               {/* Content */}
//               <div className="relative z-10">
//                 <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-600 leading-relaxed group-hover:text-gray-700">
//                   {feature.description}
//                 </p>
//               </div>

//               {/* Hover Effect Border */}
//               <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`}></div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Bottom CTA */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//           className="text-center mt-16"
//         >
//           <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12">
//             <h3 className="text-3xl font-bold text-gray-900 mb-4">
//               Ready to Transform Your Healthcare Experience?
//             </h3>
//             <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
//               Join thousands of users who are already benefiting from our AI-powered health platform
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl">
//                 Get Started Now
//               </button>
//               <button className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-full border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg">
//                 Learn More
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default Features;

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaRobot, 
  FaLanguage, 
  FaDatabase, 
  FaBell, 
  FaCoins, 
  FaMicrophone, 
  FaCamera, 
  FaQrcode,
  FaHeartbeat,
  FaShieldAlt,
  FaUserMd,
  FaMobile
} from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: <FaLanguage className="text-4xl text-blue-500" />,
      title: "Multilingual Support",
      description: "Communicate in 6+ languages including English, Hindi, Marathi, Bengali, Tamil, and Telugu",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaHeartbeat className="text-4xl text-red-500" />,
      title: "Symptom Analysis",
      description: "AI-powered symptom checker with 80%+ accuracy for preliminary health assessment",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: <FaDatabase className="text-4xl text-green-500" />,
      title: "Government Integration",
      description: "Connected to MoHFW and IDSP databases for authentic health information",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <FaBell className="text-4xl text-orange-500" />,
      title: "Real-time Alerts",
      description: "Outbreak notifications with HMAC verification for security and authenticity",
      color: "from-orange-500 to-yellow-500"
    },
    {
      icon: <FaCoins className="text-4xl text-purple-500" />,
      title: "Blockchain Rewards",
      description: "Earn tokens for health engagement and preventive care activities",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: <FaMicrophone className="text-4xl text-indigo-500" />,
      title: "Voice Input",
      description: "Speak your symptoms and concerns using advanced speech recognition",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: <FaCamera className="text-4xl text-pink-500" />,
      title: "Image Analysis",
      description: "Upload photos of symptoms, rashes, or medical documents for analysis",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <FaQrcode className="text-4xl text-teal-500" />,
      title: "Medicine Scanner",
      description: "OCR-based medicine information extraction from packaging and prescriptions",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: <FaUserMd className="text-4xl text-emerald-500" />,
      title: "Clinician Dashboard",
      description: "Professional interface for healthcare providers to monitor and assist patients",
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: <FaMobile className="text-4xl text-violet-500" />,
      title: "WhatsApp Integration",
      description: "Access health services directly through WhatsApp and SMS messaging",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: <FaShieldAlt className="text-4xl text-amber-500" />,
      title: "Vaccination Tracker",
      description: "Personalized vaccination schedules and reminders for all age groups",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <FaRobot className="text-4xl text-slate-500" />,
      title: "AI Chatbot",
      description: "24/7 intelligent conversational AI trained on medical knowledge base",
      color: "from-slate-500 to-gray-500"
    }
  ];

  return (
    <section className="py-20">
      <div className="container-1200">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">
            Comprehensive Healthcare Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Powered by cutting-edge AI technology and integrated with government health systems 
            to provide you with the most accurate and reliable healthcare assistance
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const spotlightClass =
              feature.color.includes('indigo') ? 'spotlight-indigo' :
              feature.color.includes('purple') ? 'spotlight-purple' :
              feature.color.includes('cyan') ? 'spotlight-cyan' :
              feature.color.includes('emerald') ? 'spotlight-emerald' :
              feature.color.includes('rose') ? 'spotlight-rose' :
              feature.color.includes('yellow') || feature.color.includes('amber') ? 'spotlight-amber' :
              feature.color.includes('green') ? 'spotlight-emerald' :
              feature.color.includes('blue') ? 'spotlight-indigo' : 'spotlight-indigo';

            const handleMove = (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.style.setProperty('--x', `${x}px`);
              e.currentTarget.style.setProperty('--y', `${y}px`);
            };

            return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.03 }}
              onMouseMove={handleMove}
              className={`relative group rounded-3xl p-10 bg-white/5 backdrop-blur-md shadow-xl border border-white/10 hover:shadow-2xl transition-all duration-300 overflow-hidden tilt-hover hover-spotlight ${spotlightClass}`}
            >
              {/* Gradient Hover Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}></div>

              {/* Icon */}
              <div className="relative z-10 mb-7">
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-3">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-300 group-hover:text-white leading-normal">
                  {feature.description}
                </p>
              </div>

              {/* Animated Gradient Border */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`}></div>
            </motion.div>
          )})}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white/5 rounded-3xl p-12 backdrop-blur-md shadow-lg border border-white/10">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Healthcare Experience?
            </h3>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already benefiting from our AI-powered health platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="relative px-8 py-4 btn-primary overflow-hidden">
                <span className="absolute w-2 h-2 bg-white rounded-full animate-ping top-2 left-4"></span>
                Get Started Now
              </button>
              <button className="px-8 py-4 btn-secondary">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
