import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import mojs from '@mojs/core';

// Layout component
const Layout = ({
  children,
  isFlipped,
  onFlip
}: {
  children: React.ReactNode[];
  isFlipped: boolean;
  onFlip: () => void;
}) => {
  return (
    <div className="flip-card w-full h-full min-h-[450px]" onClick={onFlip}>
      <div
        className={`flip-card-inner w-full h-full relative transition-transform duration-500 ${
          isFlipped ? 'flip-card-flipped' : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
};

// DateCounter component
const DateCounter = ({ startDate, label }: { startDate: Date; label: string }) => {
  const calculateTimeElapsed = (fromDate: Date) => {
    const now = new Date();
    let years = now.getFullYear() - fromDate.getFullYear();
    let months = now.getMonth() - fromDate.getMonth();
    let days = now.getDate() - fromDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, fromDate.getDate());
      days = Math.floor((now.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24));
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  };

  const [timeElapsed, setTimeElapsed] = useState(calculateTimeElapsed(startDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(calculateTimeElapsed(startDate));
    }, 1000 * 60 * 60 * 24);

    return () => clearInterval(timer);
  }, [startDate]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300 w-full md:w-[280px]">
      <h2 className="text-2xl font-bold text-purple-600 mb-4 text-center">{label}</h2>
      <div className="space-y-2 text-center">
        {timeElapsed.years > 0 && (
          <p className="text-xl">
            <span className="font-bold text-purple-500">{timeElapsed.years}</span> years
          </p>
        )}
        <p className="text-xl">
          <span className="font-bold text-purple-500">{timeElapsed.months}</span> months
        </p>
        <p className="text-xl">
          <span className="font-bold text-purple-500">{timeElapsed.days}</span> days
        </p>
      </div>
    </div>
  );
};

// LoveAnimation component
const LoveAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<mojs.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const letters = ['n','h','e','b','E','k',' ','b','a','r','c','h','a',' ','B','o','u','B','o','u',' ','Y','a','7','l','a',' ','t','o','f','l','a',' ','f','i','l','a',' ','d','e','n','y','a'];
    const elements: HTMLSpanElement[] = [];
    
    // Clear any previous content
    containerRef.current.innerHTML = '';
    
    letters.forEach((letter) => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.className = 'animated-letter';
      span.style.display = 'inline-block';
      span.style.position = 'relative';
      span.style.fontSize = '2rem';
      span.style.opacity = '0';
      span.style.letterSpacing = '1px';
      containerRef.current?.appendChild(span);
      elements.push(span);
    });

    const timeline = new mojs.Timeline();
    const move = 1000;
    const delta = 150;
    
    elements.forEach((el, i) => {
      const tween = new mojs.Tween({
        duration: move,
        delay: i * delta,
        easing: "sin.inOut",
        onStart: () => {
          el.style.opacity = '1';
        },
        onUpdate: (progress: number) => {
          el.style.transform = `translateY(${Math.sin(progress * Math.PI) * -20}px)`;
        },
        onComplete: () => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(0)';
        }
      });
      
      timeline.add(tween);
    });

    const totalDuration = move + (letters.length - 1) * delta + 500;

    const playAnimation = () => {
      elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(0)';
      });
      
      timeline.replay();
    };

    playAnimation();
    const interval = setInterval(playAnimation, totalDuration);

    return () => {
      clearInterval(interval);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-10 mb-24 p-4 md:p-8 rounded-2xl text-center w-full max-w-[1200px] mx-auto overflow-x-hidden"
      style={{ whiteSpace: 'nowrap', background: 'transparent' }}
    >
      <style jsx>{`
        .animated-letter {
          font-family: "Edu AU VIC WA NT Arrows", sans-serif;
          font-weight: 700;
          color: #ff85dc;
        }
        /*
        Alternative font (Dancing Script):
        .animated-letter {
          font-family: "Dancing Script", cursive;
          font-weight: 700;
          color: #ff85dc;
        }
        */
      `}</style>
    </div>
  );
};

// FloatingHearts component
const FloatingHearts = () => (
  <div className="absolute inset-0 overflow-hidden">
    {[...Array(30)].map((_, i) => (
      <Heart
        key={i}
        className="absolute text-purple-300 opacity-30 animate-float"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          transform: `scale(${Math.random() * 0.8 + 0.5})`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${Math.random() * 3 + 4}s`,
        }}
      />
    ))}
  </div>
);

// Main App component
export default function App() {
  const [isFlipped, setIsFlipped] = useState(false);
  const heartRef = useRef<HTMLDivElement>(null);

  const handleHeartClick = () => {
    if (!heartRef.current) return;

    new mojs.Burst({
      parent: heartRef.current,
      radius: { 0: 100 },
      count: 10,
      children: {
        shape: 'heart',
        fill: ['#9333ea', '#db2777', '#e879f9'],
        radius: 10,
        duration: 2000,
        easing: 'cubic.out'
      }
    }).play();

    new mojs.Html({
      el: heartRef.current,
      duration: 300,
      scale: { 1: 1.5 },
      easing: 'cubic.out',
      onComplete: () => {
        new mojs.Html({
          el: heartRef.current,
          duration: 300,
          scale: { 1.5: 1 },
          easing: 'cubic.in'
        }).play();
      }
    }).play();
  };

  const toggleFlipped = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 flex flex-col items-center justify-center relative overflow-hidden px-4 py-8">
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <Heart className="w-full h-full max-w-4xl max-h-4xl text-purple-500 animate-pulse-slow" />
      </div>
      
      <FloatingHearts />
      <LoveAnimation />

      <div className="relative w-full max-w-3xl h-[450px] z-10 mb-24">
        <Layout isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)}>
          <div className="front absolute w-full h-full bg-gradient-to-br from-purple-50/90 to-pink-50/90 rounded-2xl p-6 md:p-8 shadow-xl space-y-6 md:space-y-8 flex flex-col items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 mb-2 md:mb-4 text-center">Our Love Journey</h1>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full justify-center">
              <DateCounter 
                startDate={new Date(2024, 6, 31)} 
                label="owwwwww kitty"
              />
              <DateCounter 
                startDate={new Date(2024, 8, 24)} 
                label="Since We Became One"
              />
            </div>
          </div>

          <div className="back absolute w-full h-full bg-gradient-to-br from-purple-50/90 to-pink-50/90 rounded-2xl p-6 md:p-8 shadow-xl flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gradient bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 mb-4 md:mb-6">My Eternal Promise</h2>
              <p className="text-base md:text-lg text-purple-600 leading-relaxed max-w-2xl">
                My dearest, every moment with you is precious. I cherish our laughs, 
                our talks, and even our quiet moments. You're my forever love, and I 
                promise to stand by you through all of life's adventures. I love you 
                more than words can express.
              </p>
            </div>
          </div>
        </Layout>

        <button 
          onClick={toggleFlipped}
          className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transition-colors duration-300 flex items-center gap-2"
        >
          <Heart size={18} />
          {isFlipped ? 'Show Front' : 'Show Back'}
          <Heart size={18} />
        </button>
      </div>

      <div
        ref={heartRef}
        onClick={handleHeartClick}
        className="cursor-pointer text-purple-500 hover:text-pink-500 transition-colors duration-300 mt-8 relative z-10"
      >
        <Heart size={60} className="hover:scale-110 transition-transform duration-200" />
      </div>

      <style jsx global>{`
        .animate-float {
          animation: float 7s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .animate-pulse-slow {
          animation: pulse 5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }

        .flip-card {
          perspective: 1000px;
        }

        .flip-card-inner {
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }

        .flip-card-flipped {
          transform: rotateY(180deg);
        }

        .front, .back {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .back {
          transform: rotateY(180deg);
        }
        
        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}