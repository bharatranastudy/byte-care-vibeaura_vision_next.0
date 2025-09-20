// import React from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   FaFacebook, 
//   FaTwitter, 
//   FaLinkedin, 
//   FaInstagram, 
//   FaGithub,
//   FaHeartbeat,
//   FaPhone,
//   FaEnvelope,
//   FaMapMarkerAlt
// } from 'react-icons/fa';

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {/* Brand Section */}
//           <div className="col-span-1 lg:col-span-2">
//             <div className="flex items-center space-x-3 mb-4">
//               <FaHeartbeat className="text-3xl text-blue-400" />
//               <h3 className="text-2xl font-bold">SIH Health Bot</h3>
//             </div>
//             <p className="text-gray-300 mb-6 max-w-md">
//               Your AI-powered healthcare companion providing multilingual support, 
//               symptom analysis, vaccination schedules, and blockchain rewards for better health outcomes.
//             </p>
//             <div className="flex space-x-4">
//               <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
//                 <FaFacebook className="text-xl" />
//               </a>
//               <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
//                 <FaTwitter className="text-xl" />
//               </a>
//               <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
//                 <FaLinkedin className="text-xl" />
//               </a>
//               <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
//                 <FaInstagram className="text-xl" />
//               </a>
//               <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
//                 <FaGithub className="text-xl" />
//               </a>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
//             <ul className="space-y-2">
//               <li>
//                 <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
//                   Dashboard
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/health-analysis" className="text-gray-300 hover:text-white transition-colors">
//                   Health Analysis
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/vaccination-schedule" className="text-gray-300 hover:text-white transition-colors">
//                   Vaccination Schedule
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/medicine-scanner" className="text-gray-300 hover:text-white transition-colors">
//                   Medicine Scanner
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/wallet" className="text-gray-300 hover:text-white transition-colors">
//                   Wallet
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/outbreak-alerts" className="text-gray-300 hover:text-white transition-colors">
//                   Outbreak Alerts
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div>
//             <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
//             <div className="space-y-3">
//               <div className="flex items-center space-x-3">
//                 <FaPhone className="text-blue-400" />
//                 <span className="text-gray-300">+91 1800-XXX-XXXX</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <FaEnvelope className="text-blue-400" />
//                 <span className="text-gray-300">support@sihealthbot.com</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <FaMapMarkerAlt className="text-blue-400" />
//                 <span className="text-gray-300">New Delhi, India</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="border-t border-gray-800 mt-8 pt-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="text-gray-400 text-sm mb-4 md:mb-0">
//               © 2024 SIH Health Bot. All rights reserved. | Smart India Hackathon Project
//             </div>
//             <div className="flex space-x-6 text-sm">
//               <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
//                 Privacy Policy
//               </Link>
//               <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
//                 Terms of Service
//               </Link>
//               <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
//                 About Us
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;




import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaGithub,
  FaHeartbeat,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <FaHeartbeat className="text-4xl" />
              <h3 className="text-2xl font-extrabold tracking-tight gradient-text">ByteCare</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Your AI-powered healthcare companion providing multilingual support, 
              symptom analysis, vaccination schedules, and blockchain rewards for better health outcomes.
            </p>
            <div className="flex space-x-4">
              {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGithub].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"
                >
                  <Icon className="text-2xl" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-200">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { text: "Dashboard", to: "/dashboard" },
                { text: "Health Analysis", to: "/health-analysis" },
                { text: "Vaccination Schedule", to: "/vaccination-schedule" },
                { text: "Medicine Scanner", to: "/medicine-scanner" },
                { text: "Wallet", to: "/wallet" },
                { text: "Outbreak Alerts", to: "/outbreak-alerts" },
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    to={link.to} 
                    className="text-gray-400 hover:text-white transition-colors transform hover:translate-x-1 duration-300"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-200">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaPhone className="text-gradient-to-r from-blue-400 to-purple-500" />
                <span className="text-gray-300 hover:text-white transition-colors">+91 1800-XXX-XXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-gradient-to-r from-blue-400 to-purple-500" />
                <span className="text-gray-300 hover:text-white transition-colors">support@sihealthbot.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-gradient-to-r from-blue-400 to-purple-500" />
                <span className="text-gray-300 hover:text-white transition-colors">New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0 text-center md:text-left">
              © 2024 ByteCare. All rights reserved. | Smart India Hackathon Project
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
              {[
                { text: "Privacy Policy", to: "/privacy" },
                { text: "Terms of Service", to: "/terms" },
                { text: "About Us", to: "/about" },
              ].map((link, i) => (
                <Link 
                  key={i} 
                  to={link.to} 
                  className="text-gray-400 hover:text-white transition-colors transform hover:scale-105 duration-300"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
