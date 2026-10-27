import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

export default function TypedInfo() {
  // Create reference to store the DOM element containing the animation
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ['<i>Gestiona</i> inventario.', '<i>Agiliza</i> procesos.', '<span>Dashboard</span> intuitivo'],
      typeSpeed: 100,
      loop: true
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="App">
      <span ref={el} />
    </div>
  );
}