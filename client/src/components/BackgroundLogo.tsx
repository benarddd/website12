import { useEffect, useState } from 'react';
import SchoolLogo from './SchoolLogo';

interface BackgroundLogoProps {
  count?: number;
  opacity?: number;
  dynamic?: boolean;
}

export default function BackgroundLogo({ count = 5, opacity = 0.1, dynamic = true }: BackgroundLogoProps) {
  const [logos, setLogos] = useState<JSX.Element[]>([]);

  // Create more dynamic logos with varied animations
  useEffect(() => {
    const generatedLogos = [];
    
    for (let i = 0; i < count; i++) {
      // Generate random positions with better distribution
      const topPosition = Math.floor(Math.random() * 90);
      const leftPosition = Math.floor(Math.random() * 90);
      
      // Create more variety in animations
      const animationType = Math.floor(Math.random() * 3); // 0, 1, or 2
      const intensityType = Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low";
      const rotationSpeed = Math.random() > 0.7 ? "fast" : Math.random() > 0.4 ? "medium" : "slow";
      
      // Randomly decide if logo should have continuous animation
      const hasContinuousAnimation = dynamic && Math.random() > 0.5;
      
      // Vary sizes more dramatically for depth effect
      const sizeOptions = ["medium", "large", "xlarge"];
      const size = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
      
      generatedLogos.push(
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: `${topPosition}%`,
            left: `${leftPosition}%`,
            opacity: opacity * (0.8 + Math.random() * 0.4), // Vary opacity slightly
            zIndex: Math.floor(Math.random() * 5) - 5,       // Varied z-index for parallax effect
            transform: `scale(${0.8 + Math.random() * 0.5})` // Random scaling for depth
          }}
        >
          <SchoolLogo 
            size={size as any}
            animated={dynamic}
            floating={dynamic && (animationType === 0 || hasContinuousAnimation)}
            pulse={dynamic && (animationType === 1 || hasContinuousAnimation)}
            colorEffect={dynamic && animationType === 2}
            continuous={hasContinuousAnimation}
            withShadow={true}
            intensity={intensityType as any}
            rotationSpeed={rotationSpeed as any}
          />
        </div>
      );
    }
    
    setLogos(generatedLogos);
  }, [count, opacity, dynamic]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden" style={{ zIndex: -1 }}>
      {logos}
    </div>
  );
}