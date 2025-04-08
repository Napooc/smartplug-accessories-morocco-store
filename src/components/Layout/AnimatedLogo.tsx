
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
    let yOffset = 0;
    let yDirection = 1;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Draw the modern 3D logo
    const drawLogo = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.8;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Save context state
      ctx.save();
      ctx.translate(centerX, centerY + yOffset);
      
      // Add floating effect
      yOffset += 0.1 * yDirection;
      if (Math.abs(yOffset) > 2) {
        yDirection *= -1;
      }
      
      // 3D Effect - Shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
      
      // Smart plug base (circular)
      const gradient = ctx.createLinearGradient(-radius, -radius, radius, radius);
      gradient.addColorStop(0, '#3B82F6');
      gradient.addColorStop(1, '#1E40AF');
      
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Inner circle for 3D effect
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Inner ring
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = '#2563EB';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = '#1D4ED8';
      ctx.fill();
      
      // Rotate the plug prongs and electricity elements
      ctx.rotate(rotation);
      
      // Plug prongs (3D effect with highlights)
      ctx.fillStyle = '#F9FAFB';
      
      // First prong with 3D effect
      ctx.save();
      ctx.fillStyle = '#E5E7EB';
      ctx.fillRect(-radius * 0.45, -radius * 0.28, radius * 0.65, radius * 0.2);
      ctx.restore();
      
      ctx.fillStyle = '#F9FAFB';
      ctx.fillRect(-radius * 0.5, -radius * 0.25, radius * 0.7, radius * 0.2);
      
      // Second prong with 3D effect
      ctx.save();
      ctx.fillStyle = '#E5E7EB';
      ctx.fillRect(-radius * 0.45, radius * 0.08, radius * 0.65, radius * 0.2);
      ctx.restore();
      
      ctx.fillStyle = '#F9FAFB';
      ctx.fillRect(-radius * 0.5, radius * 0.05, radius * 0.7, radius * 0.2);
      
      // Electricity bolt in the middle (more dynamic with glow)
      ctx.beginPath();
      ctx.moveTo(radius * 0.1, -radius * 0.3);
      ctx.lineTo(-radius * 0.15, 0);
      ctx.lineTo(radius * 0.25, 0);
      ctx.lineTo(radius * 0.1, radius * 0.3);
      
      // Add glow effect to bolt
      ctx.shadowColor = '#FBBF24';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#FBBF24';
      ctx.fill();
      
      // Additional electricity particles for enhanced effect
      const particles = 8;
      const particleSize = radius * 0.05;
      
      ctx.shadowBlur = 5;
      ctx.fillStyle = '#FEF3C7';
      
      for (let i = 0; i < particles; i++) {
        const angle = (Math.PI * 2 / particles) * i + rotation * 2;
        const distance = radius * 0.35;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        ctx.beginPath();
        ctx.arc(x, y, particleSize * (0.5 + Math.sin(rotation * 5 + i) * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Restore context state
      ctx.restore();
      
      // Update rotation for animation (slightly faster)
      rotation += 0.015;
      
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
