import React, { useRef, useEffect, useState } from 'react';

const NeuralParticles = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const particlesRef = useRef([]);
  const animationIdRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  // Configurações baseadas no site de referência
  const config = {
    maxParticles: 150,
    maxDistance: 150,
    mouseRadius: 200,
    mouseForce: 0.8,
    friction: 1.0,
    baseSpeed: 3.0,
    shadowBlur: 15,
    connectionOpacity: 0.3,
    particleColors: ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#1d4ed8'],
    particleOpacity: 1.0,
    minSize: 3,
    maxSize: 5
  };

  // Criar partículas
  const createParticles = (width, height) => {
    const particles = [];
    for (let i = 0; i < config.maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * config.baseSpeed,
        vy: (Math.random() - 0.5) * config.baseSpeed,
        color: config.particleColors[Math.floor(Math.random() * config.particleColors.length)],
        opacity: config.particleOpacity,
        size: Math.random() * (config.maxSize - config.minSize) + config.minSize
      });
    }
    return particles;
  };

  // Atualizar partículas
  const updateParticles = (particles, width, height) => {
    const mouse = mouseRef.current;
    
    // Sem sistema de reprodução - partículas fixas como no site original
    
    particles.forEach(particle => {
      // Fricção
      particle.vx *= config.friction;
      particle.vy *= config.friction;
      
      // Adicionar movimento suave e contínuo
      if (Math.random() < 0.1) {
        particle.vx += (Math.random() - 0.5) * 0.1;
        particle.vy += (Math.random() - 0.5) * 0.1;
      }
      
      // Movimento perpétuo - sem perda de energia

      // Repulsão do mouse
      if (mouse.active) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distanceSquared = dx * dx + dy * dy;
        
        if (distanceSquared < config.mouseRadius * config.mouseRadius) {
          const distance = Math.sqrt(distanceSquared);
          const force = (1 - distance / config.mouseRadius) * config.mouseForce;
          const normalizedX = dx / distance;
          const normalizedY = dy / distance;
          
          particle.vx -= normalizedX * force;
          particle.vy -= normalizedY * force;
        }
      }

      // Atualizar posição
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bordas infinitas (wrap-around)
      if (particle.x < 0) {
        particle.x = width;
      } else if (particle.x > width) {
        particle.x = 0;
      }
      
      if (particle.y < 0) {
        particle.y = height;
      } else if (particle.y > height) {
        particle.y = 0;
      }
    });
  };

  // Desenhar conexões
  const drawConnections = (ctx, particles) => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.maxDistance) {
          const opacity = (1 - distance / config.maxDistance) * config.connectionOpacity;
          
          // Efeito de brilho sutil nas conexões
          ctx.shadowBlur = 2;
          ctx.shadowColor = '#ffffff';
          ctx.strokeStyle = `#ffffff`; // Cor branca
          ctx.globalAlpha = opacity;
          ctx.lineWidth = 1; // Linha mais fina
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          
          // Reset
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }
      }
    }
  };

  // Desenhar partículas
  const drawParticles = (ctx, particles) => {
    particles.forEach(particle => {
      ctx.shadowBlur = config.shadowBlur;
      ctx.shadowColor = particle.color;
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    });
  };

  // Loop de animação
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;

    // Limpar canvas
    ctx.clearRect(0, 0, width, height);

    // Atualizar e desenhar
    updateParticles(particlesRef.current, width, height);
    drawConnections(ctx, particlesRef.current);
    drawParticles(ctx, particlesRef.current);
    

    // Continuar animação
    animationIdRef.current = requestAnimationFrame(animate);
  };

  // Configurar canvas
  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    setDimensions({ width, height });
    particlesRef.current = createParticles(width, height);
    setIsInitialized(true);
    animate();
  };

  // Event handlers
  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = event.clientX - rect.left;
    mouseRef.current.y = event.clientY - rect.top;
    mouseRef.current.active = true;
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  const handleResize = () => {
    setupCanvas();
  };

  useEffect(() => {
    // Inicialização mais robusta
    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setTimeout(initCanvas, 50);
        return;
      }
      setupCanvas();
    };

    initCanvas();

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('resize', handleResize);
      
      setIsInitialized(false);
      particlesRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!isInitialized && dimensions.width > 0 && dimensions.height > 0) {
      particlesRef.current = createParticles(dimensions.width, dimensions.height);
      setIsInitialized(true);
      if (!animationIdRef.current) {
        animate();
      }
    }
  }, [isInitialized, dimensions]);

  // Effect adicional para garantir que as partículas sempre apareçam
  useEffect(() => {
    const checkAndRestart = () => {
      if (particlesRef.current.length === 0 && dimensions.width > 0 && dimensions.height > 0) {
        particlesRef.current = createParticles(dimensions.width, dimensions.height);
        setIsInitialized(true);
        if (!animationIdRef.current) {
          animate();
        }
      }
    };

    const interval = setInterval(checkAndRestart, 500); // Verifica a cada 500ms
    return () => clearInterval(interval);
  }, [dimensions]);

  // Effect para reinicializar após mudanças de rota (logout/login)
  useEffect(() => {
    const forceRestart = () => {
      if (dimensions.width > 0 && dimensions.height > 0) {
        particlesRef.current = createParticles(dimensions.width, dimensions.height);
        setIsInitialized(true);
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        animate();
      }
    };

    // Reinicializa após um pequeno delay para garantir que o DOM esteja pronto
    const timeout = setTimeout(forceRestart, 200);
    return () => clearTimeout(timeout);
  }, []); // Executa apenas uma vez quando o componente é montado

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-auto"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        zIndex: -1
      }}
      aria-hidden="true"
    />
  );
};

export default NeuralParticles;