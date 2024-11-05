import { Variants, motion } from "framer-motion";
import { useLayoutEffect, useState } from "react";
import './transition.css';

export const TransitionOverlay = ({ children }: { children: JSX.Element }) => {
  const [locationName, setLocationName] = useState("");

  useLayoutEffect(() => {
    const locationArr = location.pathname
      .split("/")
      .filter((value: string) => value !== "");
    setLocationName(
      locationArr[locationArr.length - 1]
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
    setTimeout(() => {
      window.scrollTo({ top: 0 });
    }, 800);
  }, [location.pathname]);

  const anim = (variants: Variants) => ({
    initial: "initial",
    animate: "enter",
    exit: "exit",
    variants,
  });

  const expand: Variants = {
    initial: {
      left: "0vw",
    },
    enter: {
      left: "100vw",
      transition: {
        duration: 0.75,
        delay: 0.5,
        ease: [0.76, 0, 0.24, 1],
      },
      transitionEnd: {
        left: "-200vw",
      },
    },
    exit: {
      x: "200vw",
      transition: {
        duration: 0.75,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  return (
    <>
      <section>
        {/* <Navbar /> */}
        <div className="page">
          <div
            className="transition-container"
            style={{
              height: "100dvh",
              width: "100%",
              position: "fixed",
              top: 0,
              left: 0,
              pointerEvents: "none",
              display: "flex",
              zIndex: 999999,
            }}
          >
            <motion.div
              {...anim(expand)}
              style={{
                position: "relative",
                height: "100%",
                width: "100%",
                backgroundColor: "#0c0a09",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="__card-page-name">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{
                    y: "0%",
                    transitionEnd: { y: "100%", transitionDelay: "1s" },
                  }}
                  className="inline-block"
                >{"Welcome"}
                  {/* {locationName.charAt(0).toUpperCase() +
                    locationName.slice(1) ===
                  "Portfolio"
                    ? "Welcome Home"
                    : locationName.charAt(0).toUpperCase() +
                      locationName.slice(1)} */}
                </motion.span>
              </div>
            </motion.div>
          </div>
          <main>{children}</main>
        </div>
      </section>
      {/* <Footer /> */}
    </>
  );
};
