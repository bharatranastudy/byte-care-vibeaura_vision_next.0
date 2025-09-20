import React from 'react';
import { motion } from 'framer-motion';

const WhyUs = () => {
  return (
    <section className="py-20">
      <div className="container-1200 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="order-2 lg:order-1"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Why choose <span className="gradient-text">ByteCare</span>
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            Clean, modern experience with privacy-first design. Built with trusted data sources and
            thoughtful UX to keep your health journey simple and secure.
          </p>

          <ul className="space-y-4">
            {[
              {
                title: 'Trusted data & security',
                desc: 'Integrated with reliable sources, secured using modern best practices.',
              },
              {
                title: 'Smooth, professional UX',
                desc: 'Fast, responsive interface with subtle motion and clear call-to-actions.',
              },
              {
                title: 'Proactive insights',
                desc: 'Outbreak alerts, vaccination reminders, and AI guidance tailored to you.',
              },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                <div>
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-gray-400">{item.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Image/Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="order-1 lg:order-2"
        >
          <div className="relative tilt-hover rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-600/20" />
            {/* Placeholder visual: gradient panel mimicking dashboard */}
            <div className="relative p-6 bg-white/5 backdrop-blur-md">
              <div className="grid grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-2xl bg-white/10 border border-white/10 hover:border-white/20 transition-colors"
                  />
                ))}
              </div>
              <div className="mt-6 h-10 rounded-full bg-white/10 border border-white/10" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUs;
