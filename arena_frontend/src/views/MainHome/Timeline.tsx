import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";
// import './Timeline.css';

interface Event {
  title: string;
  description: string;
}

interface TimelineItemProps {
  event: Event;
  align: "left" | "right";
}

const CTimelineItem: React.FC<TimelineItemProps> = ({ event, align }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <motion.div
      ref={ref}
      // initial={{ opacity: 0, x: align === "left" ? "-80%" : "80%" }}
      initial={{scale:0, opacity: 0}}
      animate={
        isInView? {scale: 1, opacity: 1}:{scale: 0, opacity: 0}
        // isInView
        //   ? { opacity: 1, x: 0 }
        //   : { opacity: 0, x: align === "left" ? "-80%" : "80%" }
      }
      transition={{
        type: "spring", // Use spring animation
        delay: 0.2, // Stagger each letter’s entrance
        stiffness: 100, // Adjusts the spring's tension
        damping: 20,
      }}
    >
      <div style={{color: 'var(--text-color)',minWidth: '200px',width: '50%',  backgroundColor: '#ffff', display: 'grid', placeItems: 'center', borderRadius: '1rem', float: align === "left"?'right':'left', height: '100px'}}>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
      </div>
    </motion.div>
  );
};

interface TimelineProps {
  events: Event[];
}

// const cTimeline: React.FC<TimelineProps> = ({ events }) => {
//   return (
//     <div className="timeline-container">
//       {events.map((event, index) => (
//         <TimelineItem
//           key={index}
//           event={event}
//           align={index % 2 === 0 ? 'left' : 'right'}
//         />
//       ))}
//     </div>
//   );
// };

export default function ClubHistory() {
  return (
    <div style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)", width: 'max(max-content, 100vw)', }}>
      <div style={{fontSize: '2.5rem', fontWeight: 700, width: 'max-content', margin: 'auto', paddingBlock: '50px'}}>
        Mile Stones
      </div>
      <Timeline position="alternate">
        <TimelineItem>
          <TimelineOppositeContent
            sx={{ m: "auto 0", color: 'rgba(var(--text-color-rgb), 60%)', }}
            align="right"
            variant="body2"
            color="text.secondary"
          >
            Thu 24th Oct 2018
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot>{/* <FastfoodIcon /> */}</TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: "120px", px: 2 }}>
          <CTimelineItem
              event={{ title: "Club Launch", description: "Hello" }}
              align={"right"}
            />
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent
            sx={{ m: "auto 0", color: 'rgba(var(--text-color-rgb), 60%)', }}
            variant="body2"
            color="text.secondary"
          >
            Thu 24th Oct 2020
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot >{/* <LaptopMacIcon /> */}</TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: "120px", px: 2 }}>
            <CTimelineItem
              event={{ title: "Hi", description: "Hello" }}
              align={"left"}
            />
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
        <TimelineOppositeContent
            sx={{ m: "auto 0", color: 'rgba(var(--text-color-rgb), 60%)', }}
            variant="body2"
            color="text.secondary"
          >
            Thu 24th Oct 2022
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot>
              {/* <HotelIcon /> */}
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: "120px", px: 2 }}>
          <CTimelineItem
              event={{ title: "Hi", description: "Hello" }}
              align={"right"}
            />
          </TimelineContent>
        </TimelineItem>
        
      </Timeline>
    </div>
  );
}
