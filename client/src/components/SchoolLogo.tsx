import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SchoolLogoProps {
  className?: string;
  size?: "small" | "medium" | "large" | "xlarge";
  animated?: boolean;
  withShadow?: boolean;
  floating?: boolean;
  pulse?: boolean;
  colorEffect?: boolean;
  rotationSpeed?: "slow" | "medium" | "fast";
  intensity?: "low" | "medium" | "high";
  continuous?: boolean;
}

export default function SchoolLogo({ 
  className = "", 
  size = "medium", 
  animated = true,
  withShadow = false,
  floating = false,
  pulse = false,
  colorEffect = false,
  rotationSpeed = "medium",
  intensity = "medium",
  continuous = false
}: SchoolLogoProps) {
  
  const [isVisible, setIsVisible] = useState(true);
  const [effectPhase, setEffectPhase] = useState(0);
  
  // Define size classes based on the size prop
  const sizeClasses = {
    small: "w-8 h-7",
    medium: "w-14 h-11",
    large: "w-20 h-16",
    xlarge: "w-32 h-28"
  };
  
  // Define rotation speed factors
  const rotationDuration = {
    slow: 8,
    medium: 5,
    fast: 2
  };
  
  // Define animation intensity levels
  const intensityFactor = {
    low: 0.5,
    medium: 1,
    high: 1.5
  };
  
  // Shadow style with intensity factor
  const shadowStyle = withShadow ? {
    filter: `drop-shadow(0 0 ${12 * intensityFactor[intensity]}px rgba(38, 166, 154, 0.8))`
  } : {};
  
  // Animation config
  const hoverAnimation = animated ? {
    scale: 1.1 * intensityFactor[intensity],
    rotate: [0, -8 * intensityFactor[intensity], 8 * intensityFactor[intensity], 0],
    transition: { duration: 0.5 / intensityFactor[intensity] }
  } : {};
  
  // Floating animation with customization
  const floatingAnimation = floating ? {
    y: [0, -10 * intensityFactor[intensity], 0],
    x: continuous ? [0, 5 * intensityFactor[intensity], 0, -5 * intensityFactor[intensity], 0] : [0],
    transition: {
      y: {
        duration: 3 / intensityFactor[intensity],
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      },
      x: {
        duration: 7 / intensityFactor[intensity],
        repeat: Infinity,
        repeatType: "mirror" as const,
        ease: "easeInOut"
      }
    }
  } : {};
  
  // Pulse animation with intensity
  const pulseAnimation = pulse ? {
    scale: [
      1, 
      1 + (0.05 * intensityFactor[intensity]), 
      1
    ],
    opacity: [
      1, 
      Math.max(0.7, 1 - (0.2 * intensityFactor[intensity])), 
      1
    ],
    transition: {
      duration: 2 / intensityFactor[intensity],
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  } : {};
  
  // Continuous rotation animation if enabled
  const continuousRotation = continuous ? {
    rotate: 360,
    transition: {
      duration: rotationDuration[rotationSpeed] * 2,
      repeat: Infinity,
      ease: "linear"
    }
  } : {};
  
  // Dynamic 3D effect based on settings
  const dynamic3DEffect = continuous ? {
    rotateX: [0, 10 * intensityFactor[intensity], 0],
    rotateY: [0, 15 * intensityFactor[intensity], 0],
    transition: {
      duration: rotationDuration[rotationSpeed],
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  } : {};
  
  // Advanced color effect animation
  useEffect(() => {
    if (colorEffect) {
      const interval = setInterval(() => {
        setIsVisible(prev => !prev);
        setEffectPhase(prev => (prev + 1) % 3);
      }, 2000 / intensityFactor[intensity]);
      
      return () => clearInterval(interval);
    }
  }, [colorEffect, intensity]);
  
  // Get color based on phase
  const getColorByPhase = () => {
    switch(effectPhase) {
      case 0: return 'rgba(38, 166, 154, 0.8)'; // Teal
      case 1: return 'rgba(64, 75, 186, 0.8)';  // Blue
      case 2: return 'rgba(126, 87, 194, 0.8)'; // Purple
      default: return 'rgba(38, 166, 154, 0.8)';
    }
  };
  
  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ 
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
        perspective: '1000px'
      }}
      animate={{
        ...floatingAnimation,
        ...pulseAnimation,
        ...continuousRotation,
        ...dynamic3DEffect
      }}
      whileHover={animated ? {
        scale: 1.2,
        rotate: [0, -10, 10, -5, 5, 0],
        transition: { duration: 0.7 }
      } : {}}
    >
      <motion.img
        src="https://i.imgur.com/WzQYOFg.png"
        alt="Gjimnazi Abdulla Keta Logo"
        className={`${sizeClasses[size]} transition-all duration-500`}
        whileHover={hoverAnimation}
        animate={continuous ? {
          scale: [1, 1.1, 1],
          transition: {
            duration: rotationDuration[rotationSpeed] / 2,
            repeat: Infinity,
            repeatType: "reverse" as const
          }
        } : {}}
        style={{
          ...shadowStyle,
          filter: colorEffect ? 
            `drop-shadow(0 0 ${12 * intensityFactor[intensity]}px ${getColorByPhase()})`
            : shadowStyle.filter || 'none',
        }}
      />
    </motion.div>
  );
}