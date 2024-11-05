import React, { useEffect, useRef } from "react";

import style from "./SmoothScroll.module.css";
import useWindowSize from './useWindowSize';

const SmoothScroll = ({ children }:{children:React.ReactNode}) => {
  // 1.
  const windowSize = useWindowSize();

  //2.
  const scrollingContainerRef = useRef<any>(null);

  // 3.
  const data = {
    ease: 0.5,
    current: 0,
    previous: 0,
    rounded: 0,
  };

  // 4.
  useEffect(() => {
    setBodyHeight();
  }, [windowSize.height]);

  const setBodyHeight = () => {
    document.body.style.height = `${
      scrollingContainerRef.current.getBoundingClientRect().height
    }px`;
  };

  // 5.
  useEffect(() => {
    requestAnimationFrame(() => smoothScrollingHandler());
  }, []);

  const smoothScrollingHandler = () => {
    data.current = window.scrollY;
    data.previous += (data.current - data.previous) * data.ease;
    data.rounded = Math.round(data.previous * 100) / 100;

    scrollingContainerRef.current.style.transform = `translateY(-${data.previous}px)`;

    // Recursive call
    requestAnimationFrame(() => smoothScrollingHandler());
  };

  return (
    <div className={style.parent}>
      <div ref={scrollingContainerRef}>{children}</div>
    </div>
  );
};

export default SmoothScroll;