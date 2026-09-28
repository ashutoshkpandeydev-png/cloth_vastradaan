import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltDegree?: number;
  glare?: boolean;
  onClick?: () => void;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  tiltDegree = 10,
  glare = true,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position normalized (-1 to 1)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for smooth fluid physics
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  // Map to 3D rotation angles
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [tiltDegree, -tiltDegree]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-tiltDegree, tiltDegree]);

  // Glare position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`perspective-1000 relative rounded-3xl transition-shadow duration-300 will-change-transform ${className}`}
    >
      {children}

      {/* Dynamic 3D Glare effect */}
      {glare && isHovered && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-20 overflow-hidden mix-blend-overlay"
          style={{
            background: `radial-gradient(circle 200px at ${glareX} ${glareY}, rgba(255,255,255,0.8), transparent 80%)`,
          }}
        />
      )}
    </motion.div>
  );
};
