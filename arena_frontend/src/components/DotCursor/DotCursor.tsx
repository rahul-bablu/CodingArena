import { useEffect, useState } from 'react';
import './DotCursor.css'; // Custom CSS for the dot cursor

const DotCursor = ({expand=false}:{expand?:boolean}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [largeDotPos, setLargeDotPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e:any) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // useEffect(() => {
  //   window.addEventListener('mousemove', handleMouseMove);

  //   return () => {
  //     window.removeEventListener('mousemove', handleMouseMove);
  //   };
  // }, []);
  useEffect(() => {
    // const moveLargeDot = () => {
    //   setLargeDotPos((prev) => ({
    //     x: prev.x + (mousePos.x - prev.x) * 0.1, // Adjust this value for slower/faster trailing
    //     y: prev.y + (mousePos.y - prev.y) * 0.1,
    //   }));
    // };

    window.addEventListener('mousemove', handleMouseMove);

    // Continuously update the large dot position at a frequent interval
    // const interval = setInterval(moveLargeDot, 16); // 16ms for 60fps smooth animation

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      // clearInterval(interval);
    };
  }, [mousePos]);

  return (
    <>
      <div
        className="dot-cursor"
        style={{
          width: expand ? '250px' : '15px' ,
          height: expand ? '250px' : '15px',
          // ...(!expand && {filter: 'none'}),
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />
    </>
  );
};

export default DotCursor;
