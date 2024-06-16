import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const quts = [
  ' "The only way to do great work is to love what you do." - Steve Jobs',
  `"Code is like humor. When you have to explain it, it's bad." - Cory House`,
  '"First, solve the problem. Then, write the code." - John Johnson',
  '"Learning to write programs stretches your mind and helps you think better, creates a way of thinking about things that I think is helpful in all domains." - Bill Gates',
  `"Programming isn't about what you know; it's about what you can figure out." - Chris Pine`,
  '"The best error message is the one that never shows up." - Thomas Fuchs',
  '"Experience is the name everyone gives to their mistakes." - Oscar Wilde',
  '"In order to be irreplaceable, one must always be different." - Coco Chanel',
  `"Don't worry if it doesn't work right. If everything did, you'd be out of a job." - Mosher's Law of Software Engineering`,
  '"The function of good software is to make the complex appear to be simple." - Grady Booch',
  '"Code never lies, comments sometimes do." - Ron Jeffries',
  '"Simplicity is the soul of efficiency." - Austin Freeman',
  '"Programs must be written for people to read, and only incidentally for machines to execute." - Harold Abelson',
  '"Before software can be reusable it first has to be usable." - Ralph Johnson',
  `"The most damaging phrase in the language is: 'It's always been done that way.'" - Grace Hopper`,
  '"Fix the cause, not the symptom." - Steve Maguire',
  '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler',
  '"Walking on water and developing software from a specification are easy if both are frozen." - Edward V. Berard',
  '"Measuring programming progress by lines of code is like measuring aircraft building progress by weight." - Bill Gates',
  '"Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away." - Antoine de Saint-Exupéry',
];

const enterFullscreen = () => {
  const docElm = document.documentElement as any;
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen();
  } else if (docElm.mozRequestFullScreen) {
    // Firefox
    docElm.mozRequestFullScreen();
  } else if (docElm.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    docElm.webkitRequestFullscreen();
  } else if (docElm.msRequestFullscreen) {
    // IE/Edge
    docElm.msRequestFullscreen();
  }
};

export function ContestLandingPage() {
  const qt = quts[Math.floor(Math.random() * quts.length + 1)];
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const buttonCSS = {
    backgroundColor: "#fda300",
    cursor: "pointer",
    padding: "10px",
    fontSize: "16px",
    width: "200px",
    fontWeight: 500,
    letterSpacing: "1px",
    fontFamily: "sans-serif",
    color: "#fff",
    outline: "none",
    border: "none",
    borderRadius: "5px",
    marginTop: "24px",
    marginBottom: "16px",
  };
  return (
    <div ref={containerRef}>
      <Navbar />
      <div
        style={{
          maxWidth: "1024px",
          paddingBottom: "64px",
          margin: "auto",
        }}
      >
        <div
          style={{
            backgroundColor: "rgb(89 68 185)",
            color: "#fff",
            margin: "32px 0",
            padding: "24px",
            borderRadius: "8px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: "40px",
                lineHeight: "52px",
                color: "#fff",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginBottom: "16px",
              }}
            >
              {"Here comes the Contest Title"}
            </div>
            <div style={{ marginTop: "-20px" }}>
              <button style={buttonCSS}>View Leaderboard</button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 12px",
                background: "#4a90e2",
                borderRadius: "4px",
                textTransform: "uppercase",
                color: "#fff",
                backgroundColor: "#4a90e2",
                // width: '-moz-fit-content',
                width: "fit-content",
                fontWeight: 500,
                fontSize: "12px",
                lineHeight: "16px",
              }}
            >
              <span>Live</span>
            </div>
            <div
              style={{
                paddingLeft: "32px",
                fontWeight: 500,
                fontSize: "18px",
                lineHeight: "24px",
              }}
            >
              {qt}
            </div>
          </div>
          <button
            style={buttonCSS}
            onClick={async () => {
              enterFullscreen();
              navigate(`/test/problems/${id}`);
            }}
          >
            Start Contest
          </button>
        </div>
      </div>
    </div>
  );
}

const FullScreenComponent = ({ children }: { children: React.ReactNode }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      } else {
        setIsFullscreen(true);
      }
    };
    document.addEventListener("keydown", (e) => {
      if (e.key == "F11") {
        e.preventDefault();
        enterFullscreen();
      }
    });
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange); // Safari
    document.addEventListener("mozfullscreenchange", handleFullscreenChange); // Firefox
    document.addEventListener("MSFullscreenChange", handleFullscreenChange); // IE/Edge
    enterFullscreen();
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ backgroundColor: "rgb(250,250,250)", width: "100%" }}
    >
      {isFullscreen ? (
        <div>{children}</div>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          textAlign="center"
          padding="20px"
        >
          <Typography sx={{maxWidth:'700px'}} gutterBottom>
            To provide the best experience and ensure fair play, this contest
            requires you to be in fullscreen mode. Please enter fullscreen mode
            to continue.
          </Typography>
          <Button variant="contained" color="primary" onClick={enterFullscreen}>
            Enter Fullscreen
          </Button>
        </Box>
      )}
    </div>
  );
};

export default FullScreenComponent;
