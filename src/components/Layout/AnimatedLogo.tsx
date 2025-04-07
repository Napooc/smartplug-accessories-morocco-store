
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large';
  withText?: boolean;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = 'medium', withText = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Determine size class based on prop
  const sizeClass = {
    small: 'h-9 w-9',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  }[size];
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let rotation = 0;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Draw the logo
    const drawLogo = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.8;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Save context state
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Draw outer circle (plug)
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#3B82F6'; // Blue
      ctx.fill();
      
      // Draw inner circle
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = '#2563EB'; // Darker blue
      ctx.fill();
      
      // Draw plug prongs
      ctx.rotate(rotation);
      
      // First prong
      ctx.fillStyle = '#F9FAFB'; // Almost white
      ctx.fillRect(-radius * 0.5, -radius * 0.25, radius * 0.7, radius * 0.2);
      
      // Second prong
      ctx.fillRect(-radius * 0.5, radius * 0.05, radius * 0.7, radius * 0.2);
      
      // Electricity bolt in the middle
      ctx.beginPath();
      ctx.moveTo(radius * 0.1, -radius * 0.3);
      ctx.lineTo(-radius * 0.1, 0);
      ctx.lineTo(radius * 0.3, 0);
      ctx.lineTo(radius * 0.1, radius * 0.3);
      ctx.fillStyle = '#FBBF24'; // Yellow
      ctx.fill();
      
      // Restore context state
      ctx.restore();
      
      // Update rotation for animation
      rotation += 0.01;
      
      // Request next frame
      animationFrameId = requestAnimationFrame(drawLogo);
    };
    
    drawLogo();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <Link to="/" className="flex items-center">
      <div className={`relative ${sizeClass}`}>
        <canvas 
          ref={canvasRef} 
          className={`w-full h-full rounded-full`}
        />
      </div>
      
      {withText && (
        <span className="ml-2 font-semibold text-xl">SmartPlug</span>
      )}
    </Link>
  );
};

export default AnimatedLogo;
