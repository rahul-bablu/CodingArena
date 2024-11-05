import { motion } from "framer-motion";

const obj = [
  `
To be a programmer is to commit to a life of constant learning. New languages, frameworks, and features are always on the horizon, challenging us to stay sharp and adaptable. In coding, lines of code are not merely produced; they’re spent with purpose. While writing code is essential, reading and refining it is often even harder—a journey where experience is built from mistakes.
`,
  `
At GCET Coding Club, we believe in staying irreplaceable by always striving to be different. Coding is like humor: true success means fixing the cause, not just the symptom. Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away. That’s why we focus on making it work, making it right, and making it fast.
`,
  `
Welcome to the GCET Coding Club—a place to code, grow, and evolve with creativity and skill.
`,
];

const SvgAnimationComplete = () => {
  return (
    <motion.svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.circle
        cx="100"
        cy="100"
        r="80"
        stroke="blue"
        strokeWidth="10"
        fill="none"
        initial={{ pathLength: 0, opacity: 0, rotate: 0 }}
        animate={{ pathLength: 1, opacity: 1, rotate: 360 }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
    </motion.svg>
  );
};

  

const Objective = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        paddingBlock: "100px",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
      }}
    >
      <div>
      <div className="__section-title" style={{paddingBottom: '75px'}}>Objective</div>
      <div
        style={{
          paddingInline: "6vw",
          textIndent: "5vw",
          textAlign: "justify",
          fontSize: "1.1rem",
          display: "flex",
          flexDirection: "column",
          rowGap: "10px",
        }}
      >
        <div style={{}}>{obj[0]}</div>
        <div>{obj[1]}</div>
        <div>{obj[2]}</div>
      </div>
      </div>
    </div>
  );
};

export default Objective;
