import { Modal } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import './anouncements.css';
const anouns = [
  {
    id: "asdfg",
    title: "Devera",
    desc: "An epic action saga set against coastal lands, which briefs about rip-roaring ,emotionally charged incidents in the periodic timeline, also comprises the titular protagonist being the rescuer to deprived and fear to evildoers.",
    img: "http://localhost:8000/WhatsApp%20Image%202024-06-12%20at%2021.29.52.jpeg",
  },
  {
    id: "sdfgh",
    title: "Kalki 2898 AD",
    desc: "The future of those in the dystopian city of Kasi is altered when the destined arrival of Lord Vishnu's final avatar launches a war against darkness.",
    img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.xmlsNZ-McYH0qAoHMesnBwHaDt%26pid%3DApi&f=1&ipt=a840809bc20f42f0992a6fbfb77e81484916116f6add9da1d0cbeaf03854b1be&ipo=images",
  },
  {
    id: "qwert",
    title: "Devera",
    desc: "An epic action saga set against coastal lands, which briefs about rip-roaring ,emotionally charged incidents in the periodic timeline, also comprises the titular protagonist being the rescuer to deprived and fear to evildoers.",
    img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.amdrQYOnMmBgOnbLdjjNkQHaEK%26pid%3DApi&f=1&ipt=fafb512199bef5c5a1c3fcb010f9846c9fe69824ecd63010d345a83c063a6dc3&ipo=images",
  },
  {
    id: "ewrver",
    title: "Devera",
    desc: "An epic action saga set against coastal lands, which briefs about rip-roaring ,emotionally charged incidents in the periodic timeline, also comprises the titular protagonist being the rescuer to deprived and fear to evildoers.",
    img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.amdrQYOnMmBgOnbLdjjNkQHaEK%26pid%3DApi&f=1&ipt=fafb512199bef5c5a1c3fcb010f9846c9fe69824ecd63010d345a83c063a6dc3&ipo=images",
  },
  {
    id: "rrvre",
    title: "Devera",
    desc: "An epic action saga set against coastal lands, which briefs about rip-roaring ,emotionally charged incidents in the periodic timeline, also comprises the titular protagonist being the rescuer to deprived and fear to evildoers.",
    img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.amdrQYOnMmBgOnbLdjjNkQHaEK%26pid%3DApi&f=1&ipt=fafb512199bef5c5a1c3fcb010f9846c9fe69824ecd63010d345a83c063a6dc3&ipo=images",
  },
  {
    id: "sdvwahfgh",
    title: "Devera",
    desc: "An epic action saga set against coastal lands, which briefs about rip-roaring ,emotionally charged incidents in the periodic timeline, also comprises the titular protagonist being the rescuer to deprived and fear to evildoers.",
    img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.amdrQYOnMmBgOnbLdjjNkQHaEK%26pid%3DApi&f=1&ipt=fafb512199bef5c5a1c3fcb010f9846c9fe69824ecd63010d345a83c063a6dc3&ipo=images",
  },
];

const Anouncements = () => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [selectedId, setSelectedId] = useState<any>(null);
  return (
    <div id="asdfghjkl" style={{ paddingBlock: "30px", color: 'var(--text-color)', backgroundColor: 'var(--bg-color)' }}>
      <div
        style={{ }}
      className="__anoun-title"
      >
        Anouncements
      </div>
      <div
      className="__anoun-cards"
        // style={{
        //   display: "flex",
        //   justifyContent: "space-evenly",
        //   gap: "20px",
        //   marginInline: "30px",
        //   paddingInline: "30px",
        //   overflowX: "auto",
        // }}
      >
        {anouns.map((anoun, index: number) => {
          return (
            <motion.div
              id={anoun.id}
              onClick={() => setSelectedId(anoun)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 10,
              }}
              style={{
                borderRadius: "1.5rem",
                backgroundColor: "var(--bg-color)",
                width: "min(350px, 90vw)",
                // marginBlock: "35px",
                minWidth: '300px',
                boxShadow: "0 10px 20px rgba(var(--text-color-rgb),0.2)",
              }}
            >
              <motion.div
                style={{
                  borderRadius: ".75rem",
                  width: "100%",
                  justifyContent: "space-evenly",
                  height: "175px",
                  padding: "10px",
                }}
              >
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // Ensures the image covers the container
                    borderRadius: "inherit", // Inherit border-radius from the parent div
                    perspective: "1000px",
                    boxShadow: "0 10px 20px rgba(var(--text-color-rgb),0.2)",
                  }}
                  src={anoun.img}
                ></img>
              </motion.div>
              <div
                style={{
                  borderRadius: ".75rem",
                  margin: "10px",
                  padding: "10px",
                }}
              >
                <h1>{anoun.title}</h1>
                {anoun.desc}
              </div>
            </motion.div>
          );
        })}
      </div>
      {selectedId && (
        <Modal
          open={selectedId != null}
          onClose={() => setSelectedId(null)}
          style={{ display: "grid", placeItems: "center" }}
        >
          <motion.div
            layoutId={selectedId.id}
            
            style={{
              borderRadius: "1.5rem",
              backgroundColor: "var(--bg-color)",
              width: "min(350px, 90vw)",
              marginBlock: "35px",
              color: 'var(--text-color)',
            }}
          >
            {/* <Button onClick={() => setSelectedId(null)} style={{borderRadius: '50%'}}> <Close/> </Button> */}
            <motion.div
              style={{
                borderRadius: ".75rem",
                width: "100%",
                justifyContent: "space-evenly",
                height: "175px",
                padding: "10px",
              }}
            >
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // Ensures the image covers the container
                  borderRadius: "inherit", // Inherit border-radius from the parent div
                  perspective: "1000px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
                }}
                src={selectedId.img}
              ></img>
            </motion.div>
            <div
              style={{
                borderRadius: ".75rem",
                margin: "10px",
                padding: "10px",
              }}
            >
              <h1>{selectedId.title}</h1>
              {selectedId.desc}
            </div>
            
          </motion.div>
        </Modal>
      )}
    </div>
  );
};

export default Anouncements;
