// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
// import { 
//   FaBars, 
//   FaTimes, 
//   FaUser, 
//   FaWallet, 
//   FaBell, 
//   FaLanguage,
//   FaCog,
//   FaSignOutAlt,
//   FaHeartbeat,
//   FaShieldAlt,
//   FaMicrophone,
//   FaCamera,
//   FaQrcode
// } from 'react-icons/fa';

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaHeartbeat } from 'react-icons/fa';

// Modern sticky transparent navbar
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Close menu on route change
    setOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Health Analysis', to: '/health-analysis' },
    { label: 'Vaccination', to: '/vaccination-schedule' },
    { label: 'Scanner', to: '/medicine-scanner' },
    { label: 'Alerts', to: '/outbreak-alerts' },
    { label: 'Quiz', to: '/health-quiz' },
    { label: 'About', to: '/about' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className={`transition-colors duration-300 ${scrolled ? 'glass-effect' : 'bg-transparent'}`}
      >
        <div className="container-1200 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-bg grid place-items-center shadow-glow">
              <FaHeartbeat className="text-white" />
            </div>
            <span className="text-lg md:text-xl font-extrabold tracking-tight gradient-text">ByteCare</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:text-white ${
                    active ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link to="/dashboard" className="ml-2 btn-primary">Get Started</Link>
          </div>

          <button
            aria-label="Toggle menu"
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10"
            onClick={() => setOpen((s) => !s)}
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          className="md:hidden overflow-hidden border-t border-white/10 bg-slate-900/80 backdrop-blur-md"
        >
          <div className="container-1200 py-4 flex flex-col gap-2">
            {navLinks.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-3 rounded-xl text-base font-medium transition-colors ${
                    active ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link to="/dashboard" className="btn-primary text-center">Get Started</Link>
          </div>
        </motion.div>
      </motion.nav>
    </header>
  );
};

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [showWallet, setShowWallet] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const location = useLocation();
  
//   // Mouse tracking for cursor effects
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);
  
//   const controls = useAnimation();
  
//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 50);
//     };
    
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);
  
//   // Handle mouse movement for cursor effects
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       mouseX.set(e.clientX);
//       mouseY.set(e.clientY);
//     };
    
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, [mouseX, mouseY]);
  
//               <div className="hidden lg:flex items-center space-x-2">
//                 {quickActions.map((action, index) => {
//                   const Icon = action.icon;
//                   return (
//                     <motion.button
//                       key={action.name}
//                       className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
//                       whileHover={{ scale: 1.1, rotate: 5 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={action.action}
//                       title={action.name}
//                     >
//                       <Icon className="text-lg" />
//                     </motion.button>
//                   );
//                 })}
//               </div>
              
//               {/* Wallet Button */}
//               <motion.button
//                 className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setShowWallet(!showWallet)}
//               >
//                 <FaWallet className="text-lg" />
//                 <motion.div
//                   className="absolute -top-1 -right-1 w-4 h-4 bg-success-500 text-white text-xs rounded-full flex items-center justify-center"
//                   animate={{ scale: [1, 1.2, 1] }}
//                   transition={{ duration: 1, repeat: Infinity }}
//                 >
//                   5
//                 </motion.div>
//               </motion.button>
              
//               {/* Notifications */}
//               <motion.button
//                 className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setShowNotifications(!showNotifications)}
//               >
//                 <FaBell className="text-lg" />
//                 <motion.div
//                   className="absolute -top-1 -right-1 w-4 h-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center"
//                   animate={{ scale: [1, 1.2, 1] }}
//                   transition={{ duration: 1, repeat: Infinity }}
//                 >
//                   3
//                 </motion.div>
//               </motion.button>
              
//               {/* User Menu */}
//               <motion.div
//                 className="relative"
//                 whileHover={{ scale: 1.05 }}
//               >
//                 <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200">
//                   <FaUser className="text-lg" />
//                   <span className="hidden sm:block font-medium">User</span>
//                 </button>
//               </motion.div>
              
//               {/* Mobile menu button */}
//               <motion.button
//                 className="md:hidden p-2 text-gray-600 hover:text-primary-600 rounded-lg"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => setIsOpen(!isOpen)}
//               >
//                 {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
//               </motion.button>
//             </div>
//           </div>
//         </div>
        
//         {/* Mobile Navigation */}
//         <motion.div
//           className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}
//           initial={{ opacity: 0, height: 0 }}
//           animate={{ 
//             opacity: isOpen ? 1 : 0, 
//             height: isOpen ? 'auto' : 0 
//           }}
//           transition={{ duration: 0.3 }}
//         >
//           <div className="px-4 py-2 space-y-1 bg-white border-t border-gray-200">
//             {navItems.map((item, index) => {
//               const Icon = item.icon;
//               const isActive = location.pathname === item.path;
              
//               return (
//                 <motion.div
//                   key={item.name}
//                   initial={{ x: -20, opacity: 0 }}
//                   animate={{ x: 0, opacity: 1 }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <Link
//                     to={item.path}
//                     className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
//                       isActive
//                         ? 'bg-primary-100 text-primary-700'
//                         : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
//                     }`}
//                     onClick={() => setIsOpen(false)}
//                   >
//                     <Icon className="text-sm" />
//                     <span className="font-medium">{item.name}</span>
//                   </Link>
//                 </motion.div>
//               );
//             })}
            
//             {/* Mobile Quick Actions */}
//             <div className="pt-4 border-t border-gray-200">
//               <div className="flex space-x-2">
//                 {quickActions.map((action, index) => {
//                   const Icon = action.icon;
//                   return (
//                     <motion.button
//                       key={action.name}
//                       className="flex-1 flex items-center justify-center space-x-2 p-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={action.action}
//                     >
//                       <Icon className="text-lg" />
//                       <span className="text-sm font-medium">{action.name}</span>
//                     </motion.button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </motion.nav>
      
//       {/* Wallet Panel */}
//       {showWallet && (
//         <motion.div
//           className="fixed top-16 right-4 z-40 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4"
//           initial={{ opacity: 0, y: -20, scale: 0.95 }}
//           animate={{ opacity: 1, y: 0, scale: 1 }}
//           exit={{ opacity: 0, y: -20, scale: 0.95 }}
//           transition={{ duration: 0.2 }}
//         >
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-800">Health Tokens</h3>
//             <button
//               onClick={() => setShowWallet(false)}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <FaTimes />
//             </button>
//           </div>
          
//           <div className="space-y-3">
//             <div className="bg-gradient-to-r from-primary-500 to-indigo-600 rounded-lg p-4 text-white">
//               <div className="text-sm opacity-90">Total Balance</div>
//               <div className="text-2xl font-bold">1,250 Tokens</div>
//             </div>
            
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Recent Transactions</span>
//                 <span className="text-primary-600">View All</span>
//               </div>
              
//               <div className="space-y-2">
//                 <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
//                   <span className="text-sm">Symptom Report</span>
//                   <span className="text-success-600 font-medium">+10</span>
//                 </div>
//                 <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
//                   <span className="text-sm">Health Quiz</span>
//                   <span className="text-success-600 font-medium">+15</span>
//                 </div>
//                 <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
//                   <span className="text-sm">Vaccination Check</span>
//                   <span className="text-success-600 font-medium">+25</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       )}
      
//       {/* Notifications Panel */}
//       {showNotifications && (
//         <motion.div
//           className="fixed top-16 right-4 z-40 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4"
//           initial={{ opacity: 0, y: -20, scale: 0.95 }}
//           animate={{ opacity: 1, y: 0, scale: 1 }}
//           exit={{ opacity: 0, y: -20, scale: 0.95 }}
//           transition={{ duration: 0.2 }}
//         >
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
//             <button
//               onClick={() => setShowNotifications(false)}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <FaTimes />
//             </button>
//           </div>
          
//           <div className="space-y-3">
//             <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
//               <div className="text-sm font-medium text-danger-800">Health Alert</div>
//               <div className="text-xs text-danger-600">Dengue outbreak reported in your area</div>
//             </div>
            
//             <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
//               <div className="text-sm font-medium text-warning-800">Vaccination Due</div>
//               <div className="text-xs text-warning-600">COVID-19 booster shot recommended</div>
//             </div>
            
//             <div className="p-3 bg-success-50 border border-success-200 rounded-lg">
//               <div className="text-sm font-medium text-success-800">Reward Earned</div>
//               <div className="text-xs text-success-600">You earned 10 tokens for health quiz</div>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </>
//   );
// };

// export default Navbar;


export default Navbar;
