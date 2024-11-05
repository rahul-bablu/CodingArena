import { motion } from 'framer-motion';
import React from 'react';
import './club-name.css';
import RippleEffect from './RippleEffect';

const FadingContainer = ({ children }:{children:React.ReactNode}) => {
    return (
      <motion.div
        style={{
          position: 'relative',
          width: '100%',
          padding: '20px',
          backgroundColor: 'lightblue',
          overflow: 'hidden',
        }}
      >
        {children}
        {/* Animated opacity overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          
          transition={{ duration: 1.5 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))',
            pointerEvents: 'none',
          }}
        />
      </motion.div>
    );
  };
  

const UncoverText = ({ text, duration = 0.8 }: {text:string, duration?:number}) => {
    return (
      <div style={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', height: '100%' }}>
        {text.split("").map((letter: string, index: number) => (
          <motion.span
            key={index}
            initial={{ opacity: 0}} // Start from the left
            animate={{ opacity: 1 }} // Animate to 0 (fully visible)
            transition={{
              duration: duration,
              delay: index * 0.5, // Stagger each letter slightly
              ease: 'easeOut'
            }}
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    );
  };

const MoveUpAnimatedText = ({
    text,
    initDelay = 0,
    classNames = "",
    delay = 0.07,
  }: {
    text: string;
    initDelay?: number;
    classNames?: string;
    delay?: number;
  }) => {
    return (
      <div className={"animated-text " + classNames}>
        {text.split("").map((letter: any, index: number) => (
        //   <span
        //     key={index}
        //     className="animated-letter"
        //     style={{ animationDelay: `${initDelay + index * delay}s` }}
        //   >
        //     {letter}
        //   </span>
        <motion.div
          key={index}
          initial={{ y: '100%' }}
          animate={{  y: '0%' }}
          
          transition={{
            type: "spring", // Use spring animation
            delay: initDelay + index * delay, // Stagger each letter’s entrance
            stiffness: 200, // Adjusts the spring's tension
            damping: 20,
          }}
          style={{ display: 'inline-block' }} // Ensure each letter stays on a new line
        >
            <motion.div
            transition={{
                type: "spring", // Use spring animation
                stiffness: 250, // Adjusts the spring's tension
                damping: 5,
              }}
            whileHover={{ scale: 1.11 }}
            whileTap={{ scale: 0.9 }}
            style={{ display: 'inline-block' }} >

          {letter}
            </motion.div>
        </motion.div>
        ))}
      </div>
    );
  };

const ClubName = ({setHovered}:{setHovered:React.Dispatch<React.SetStateAction<boolean>>}) => {
    return (
      <div>
        <RippleEffect>
        <div
          style={{
            display: "grid",
            placeItems: "center",
            fontSize: "3.75rem",
            backgroundColor: "var(--bg-color)",
            height: "100vh",
            // width: "100vw",
          }}
        >
          <div
            style={{
              position: "absolute",
              zIndex: 1,
              animationDelay: "3s",
              transform: "translateY(-10px)",
              textShadow: "rgb(50 50 50 / 20%) 13px 6px 15px",
            }}
            className="__name-bg animating-grow"
          >
            Hey!
          </div>

          <div
            className=""
            style={{
              display: "flex",
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              fontWeight: "bold",
              columnGap: "20px",
              zIndex: 2,
              lineHeight: "1",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <MoveUpAnimatedText
              text={"Coding"}
              initDelay={1}
              classNames="__name-span"
            />
            <MoveUpAnimatedText
              text={"Club"}
              initDelay={1.45}
              classNames="__name-span __stroke-only"
            />
           
          <div className='__collage-font animating-grow' style={{position: 'relative', fontSize: '1.2rem', textAlign: 'center', width: '90vw', color: 'rgba(var(--text-color-rgb), 60%)', fontWeight: 600, animationDelay: '2s', marginBottom: '5px', height: 'max-content', letterSpacing: '0.07rem'}}>
            
            {"Geethanjali Collage Of Engineering And Technology"}
          </div>
          </div>
        </div>
        </RippleEffect>
        {/* <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" id="visual"  width="100vw" height="600" version="1.1"><path d="M0 81L12.5 80.3C25 79.7 50 78.3 75 82C100 85.7 125 94.3 150 103.2C175 112 200 121 225 114.8C250 108.7 275 87.3 300 89.8C325 92.3 350 118.7 375 118.2C400 117.7 425 90.3 450 92.3C475 94.3 500 125.7 525 143.8C550 162 575 167 600 151.5C625 136 650 100 675 87.5C700 75 725 86 750 90.3C775 94.7 800 92.3 825 90C850 87.7 875 85.3 887.5 84.2L900 83L900 0L887.5 0C875 0 850 0 825 0C800 0 775 0 750 0C725 0 700 0 675 0C650 0 625 0 600 0C575 0 550 0 525 0C500 0 475 0 450 0C425 0 400 0 375 0C350 0 325 0 300 0C275 0 250 0 225 0C200 0 175 0 150 0C125 0 100 0 75 0C50 0 25 0 12.5 0L0 0Z" fill="#18b1ff" stroke-linecap="round" stroke-linejoin="miter"/></svg> */}
        </div>
    )
}

export default ClubName;