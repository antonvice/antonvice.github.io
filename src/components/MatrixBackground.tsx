import { useEffect, useRef } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters - our cyberpunk colors
    const matrix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const matrixArray = matrix.split('');
    
    // Our color scheme
    const colors = ['#2be4ea', '#fed33f', '#e8615a', '#0099ff', '#00ffff'];
    
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    // Array to store y position of drops for each column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100);
    }

    // Drawing the characters
    const draw = () => {
      // Black background with slight opacity for trail effect
      ctx.fillStyle = 'rgba(15, 18, 22, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = fontSize + 'px VT323, monospace';
      
      // Loop through drops
      for (let i = 0; i < drops.length; i++) {
        // Random character from matrix
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        
        // Random color from our palette
        const color = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillStyle = color;
        
        // Adjust opacity based on position
        const opacity = Math.max(0.1, 1 - (drops[i] * fontSize) / canvas.height);
        ctx.globalAlpha = opacity * 0.3;
        
        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Reset drop to top when it reaches bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Increment y position
        drops[i]++;
      }
      
      ctx.globalAlpha = 1;
    };

    // Start animation
    const interval = setInterval(draw, 35);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.15 }}
    />
  );
};

export default MatrixBackground;