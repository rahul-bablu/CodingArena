import React, { useState } from 'react';
import './RippleEffect.css';

interface Ripple {
  x: number;
  y: number;
  id: string;
}

const RippleEffect = ({children}: {children: React.ReactNode}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 25;
    const y = e.clientY - rect.top - 25;
    const id = Math.random().toString(36).substr(2, 9);

    setRipples([...ripples, { x, y, id }]);

    // Remove the ripple after the animation duration (3s)
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 3000);
  };

  return (
    <div className="circles" onClick={handleClick} style={{overflowX: 'hidden'}}>
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="ripple"
          style={{ top: ripple.y, left: ripple.x }}
        />
      ))}
      {children}
    </div>
  );
};

export default RippleEffect;
