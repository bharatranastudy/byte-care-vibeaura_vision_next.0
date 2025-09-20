import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TiltCard = ({ 
  children, 
  className = '', 
  tiltIntensity = 15, 
  glowIntensity = 0.8,
  perspective = 1000,
  speed = 400,
  scale = 1.05,
  glowColor = 'from-cyan-400 via-purple-500 to-pink-500',
  ...props 
}) => {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateX = (mouseY / rect.height) * tiltIntensity;
      const rotateY = (mouseX / rect.width) * -tiltIntensity;
      
      // Update mouse position for gradient effect
      const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
      const relativeY = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x: relativeX, y: relativeY });
      
      card.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      card.style.transition = `transform ${speed}ms cubic-bezier(0.23, 1, 0.320, 1)`;
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setMousePosition({ x: 50, y: 50 });
      card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
      card.style.transition = `transform ${speed}ms cubic-bezier(0.23, 1, 0.320, 1)`;
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [tiltIntensity, perspective, speed, scale]);

  return (
    <motion.div
      ref={cardRef}
      className={`relative group cursor-pointer ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ transformStyle: 'preserve-3d' }}
      {...props}
    >
      {/* Gradient Border/Glow Effect */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${glowColor} rounded-xl opacity-0 group-hover:opacity-80 transition-opacity duration-300 blur-sm`}
        style={{
          background: isHovered 
            ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(6, 182, 212, 0.8), rgba(168, 85, 247, 0.6), rgba(236, 72, 153, 0.4))`
            : undefined
        }}
      />
      
      {/* Card Content */}
      <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
        {/* Inner glow effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{
            background: isHovered 
              ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(6, 182, 212, 0.3), transparent 70%)`
              : undefined
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default TiltCard;
