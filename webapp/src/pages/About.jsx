import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaHeartbeat, 
  FaUsers, 
  FaGlobe, 
  FaShieldAlt, 
  FaAward,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaEnvelope
} from 'react-icons/fa';

const About = () => {
  const teamMembers = [
    {
      name: 'Miss Hadiqua Aashna',
      role: 'Senior Developer',
      image: '/api/placeholder/150/150',
      bio: 'Experienced engineer delivering robust frontend and backend features.',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Miss Afifa',
      role: 'Software Developer',
      image: '/api/placeholder/150/150',
      bio: 'Full-stack developer specializing in healthcare technology.',
      social: { github: '#', linkedin: '#' }
    },
    {
      name: 'Mr Daksh Patwal',
      role: 'AI/ML Engineer',
      image: '/api/placeholder/150/150',
      bio: 'Machine learning expert focused on healthcare applications.',
      social: { github: '#', linkedin: '#' }
    },
    {
      name: 'Danish Khan',
      role: 'Blockchain Developer',
      image: '/api/placeholder/150/150',
      bio: 'Blockchain specialist building decentralized health solutions.',
      social: { github: '#', twitter: '#' }
    },
    {
      name: 'Mr Ashutosh Kumar Singh',
      role: 'Senior Software Engineer',
      image: '/api/placeholder/150/150',
      bio: 'Leads complex system design and high-impact delivery across platforms.',
      social: { linkedin: '#', github: '#' }
    },
    {
      name: 'Bharat Rana',
      role: 'Cloud / DevOps Engineer',
      image: '/api/placeholder/150/150',
      bio: 'Automates infrastructure and CI/CD with reliability and scale in mind.',
      social: { linkedin: '#', github: '#' }
    }
  ];

  const achievements = [
    { icon: <FaUsers />, title: '10,000+', subtitle: 'Users Served' },
    { icon: <FaGlobe />, title: '6+', subtitle: 'Languages Supported' },
    { icon: <FaShieldAlt />, title: '99.9%', subtitle: 'Uptime' },
    { icon: <FaAward />, title: '95%', subtitle: 'User Satisfaction' }
  ];

  const features = [
    {
      title: 'AI-Powered Health Analysis',
      description: 'Advanced machine learning algorithms provide accurate symptom analysis and health recommendations.'
    },
    {
      title: 'Multilingual Support',
      description: 'Communicate in your preferred language with support for English, Hindi, Marathi, Bengali, Tamil, and Telugu.'
    },
    {
      title: 'Government Integration',
      description: 'Connected to official health databases including MoHFW and IDSP for authentic information.'
    },
    {
      title: 'Blockchain Rewards',
      description: 'Earn tokens for health activities and redeem them for healthcare services and consultations.'
    },
    {
      title: 'Real-time Alerts',
      description: 'Stay informed about health outbreaks and disease alerts with HMAC-verified notifications.'
    },
    {
      title: 'Comprehensive Tools',
      description: 'Medicine scanner, vaccination tracker, health quiz, and voice/image input capabilities.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-20">
      <div className="container-1200 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">
            About ByteCare
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Revolutionizing healthcare accessibility through AI-powered technology, 
            multilingual support, and blockchain innovation for better health outcomes.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 mb-16 backdrop-blur-md"
        >
          <div className="text-center">
            <FaHeartbeat className="text-5xl text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold font-display text-white mb-6">Our Mission</h2>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
              To democratize healthcare access by providing intelligent, multilingual health assistance 
              that bridges the gap between communities and quality healthcare services. We believe that 
              everyone deserves access to reliable health information and preventive care, regardless 
              of their location or language.
            </p>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-display text-white text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="text-center bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
              >
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl text-blue-400">{achievement.icon}</div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{achievement.title}</div>
                <div className="text-gray-300">{achievement.subtitle}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-display text-white text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow backdrop-blur-md"
              >
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-display text-white text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-shadow backdrop-blur-md"
              >
                <div className="w-24 h-24 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaUsers className="text-3xl text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-blue-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-300 text-sm mb-4">{member.bio}</p>
                <div className="flex justify-center space-x-3">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="text-blue-400 hover:text-blue-300 transition-colors">
                      <FaLinkedin />
                    </a>
                  )}
                  {member.social.github && (
                    <a href={member.social.github} className="text-gray-300 hover:text-white transition-colors">
                      <FaGithub />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a href={member.social.twitter} className="text-blue-300 hover:text-blue-200 transition-colors">
                      <FaTwitter />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-display text-white text-center mb-12">Technology Stack</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-8 backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Frontend</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• React.js</li>
                  <li>• Tailwind CSS</li>
                  <li>• Framer Motion</li>
                  <li>• React Router</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Backend</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• FastAPI</li>
                  <li>• Python</li>
                  <li>• PostgreSQL</li>
                  <li>• Redis</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-4">AI/ML</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Rasa Framework</li>
                  <li>• OpenAI Whisper</li>
                  <li>• Tesseract OCR</li>
                  <li>• Prophet</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Blockchain</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Solidity</li>
                  <li>• Ethereum</li>
                  <li>• ethers.js</li>
                  <li>• Smart Contracts</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 text-white text-center backdrop-blur-md"
        >
          <h2 className="text-3xl font-bold font-display mb-6">Get In Touch</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Have questions or want to collaborate? We'd love to hear from you!
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="mailto:team@sihealthbot.com"
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors"
            >
              <FaEnvelope />
              <span>team@sihealthbot.com</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors"
            >
              <FaGithub />
              <span>GitHub</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
