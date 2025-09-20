import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaHeartbeat, FaQrcode, FaLanguage } from 'react-icons/fa';

const courses = [
  {
    icon: <FaHeartbeat className="text-2xl text-rose-400" />,
    title: 'Symptom Checker Basics',
    desc: 'Learn how to describe symptoms and receive reliable guidance.',
    tag: 'Beginner',
  },
  {
    icon: <FaShieldAlt className="text-2xl text-emerald-400" />,
    title: 'Preventive Care 101',
    desc: 'Build healthy habits and understand vaccinations & alerts.',
    tag: 'Foundational',
  },
  {
    icon: <FaQrcode className="text-2xl text-cyan-400" />,
    title: 'Medicine Scanner Tips',
    desc: 'Scan labels and interpret results with confidence.',
    tag: 'Practical',
  },
  {
    icon: <FaLanguage className="text-2xl text-indigo-400" />,
    title: 'Multilingual Care',
    desc: 'Use ByteCare in your language for clearer communication.',
    tag: 'Multilingual',
  },
];

const Courses = () => {
  return (
    <section className="py-20">
      <div className="container-1200">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display mb-4">Explore <span className="gradient-text">Learning</span></h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Short, focused modules to help you get the most out of ByteCare.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((c, i) => {
            const spot = i === 0 ? 'spotlight-rose' : i === 1 ? 'spotlight-emerald' : i === 2 ? 'spotlight-cyan' : 'spotlight-indigo';
            const handleMove = (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.style.setProperty('--x', `${x}px`);
              e.currentTarget.style.setProperty('--y', `${y}px`);
            };
            return (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              onMouseMove={handleMove}
              className={`relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl tilt-hover overflow-hidden hover-spotlight ${spot}`}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-purple-500 to-indigo-600" />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 grid place-items-center">
                  {c.icon}
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10 text-gray-200">{c.tag}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
              <p className="text-sm text-gray-300">{c.desc}</p>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  );
};

export default Courses;
