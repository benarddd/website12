import { motion } from "framer-motion";

interface SchoolLogoProps {
  className?: string;
  size?: "small" | "medium" | "large";
  animated?: boolean;
  withShadow?: boolean;
}

export default function SchoolLogo({ 
  className = "", 
  size = "medium", 
  animated = true,
  withShadow = false
}: SchoolLogoProps) {
  
  // Define size classes based on the size prop
  const sizeClasses = {
    small: "w-8 h-7",
    medium: "w-14 h-11",
    large: "w-20 h-16"
  };
  
  // Shadow style
  const shadowStyle = withShadow ? {
    filter: 'drop-shadow(0 0 8px rgba(38, 166, 154, 0.6))'
  } : {};
  
  // Animation config
  const hoverAnimation = animated ? {
    scale: 1.1,
    rotate: [0, -10, 10, 0],
    transition: { duration: 0.5 }
  } : {};
  
  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ 
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
      }}
    >
      <motion.img
        src="https://i.imgur.com/WzQYOFg.png"
        alt="Gjimnazi Abdulla Keta Logo"
        className={`${sizeClasses[size]}`}
        whileHover={hoverAnimation}
        style={shadowStyle}
      />
    </motion.div>
  );
}