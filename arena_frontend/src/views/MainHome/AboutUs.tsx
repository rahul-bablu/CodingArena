import { motion } from "framer-motion";

const data = [
  {
    title: "Faculity Coordinaters",
    members: [
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
    ],
  },
  {
    title: "Student Coordinaters",
    members: [
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
    ],
  },
  {
    title: "Club Members",
    members: [
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
      {
        name: "Rahul",
        desg: "Student Coodinater (Coding Club)",
        bio: "This is suppose to be bio of the member ",
      },
    ],
  },
  ,
];

const AboutUs = () => {
  return (
    <div
      style={{
        width: "max(85%, 300px)",
        marginInline: "auto",
        paddingInline: "10px",
      }}
    >
      {data.map((section) => {
        return (
          <div style={{ position: "relative" }}>
            <div
              style={{
                fontFamily:
                  "Rubik, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
                background: "rgba(0, 0, 0, 0.7)",
                backdropFilter: "blur(4px)",
                position: "sticky",
                zIndex: 1,
                color: "white",
                fontWeight: 500,
                top: 55,
                paddingInline: "1.5rem",
                fontSize: "2rem",
                borderRadius: ".25rem",
                textTransform: "capitalize",
                marginBlock: "20px",
              }}
            >
              {section?.title}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                flexWrap: "wrap",
                rowGap: "20px",
              }}
            >
              {section?.members.map((member) => (
                <motion.div style={{ minHeight: "200px", display: "flex", width: '100%', flexWrap: 'wrap' }}>
                  <div style={{width: 'max(250px, 40%)', }}>
                      <img src="https://www.geethanjaliinstitutions.com/engineering/img/chairman.jpg" style={{marginInline: 'auto'}} width={300} />
                  </div>
                  <div style={{fontFamily:
                    "Rubik, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif", padding: '20px', width: '60%'}}>
                  <h1>{member.name}</h1>
                  <p>
                    <b>{member.desg}</b>
                  </p>
                  <p>{member.bio}</p>
                  </div>
                </motion.div>
              //   <motion.div
              //   whileHover={{ scale: 1.06 }}
              // whileTap={{ scale: 0.96 }}
              // transition={{
              //   type: "spring",
              //   stiffness: 150,
              //   damping: 10,
              // }}
              //     style={{
              //       minHeight: "200px",
              //       borderRadius: "1.5rem",
              //       //   backgroundColor: "var(--bg-color)",
              //       width: "min(350px, 90vw)",
              //       // marginBlock: "35px",
              //       minWidth: "300px",
              //       boxShadow: "0 10px 20px rgba(var(--text-color-rgb),0.3)",
              //     }}
              //   >
              //     <motion.div
              //       style={{
              //         borderRadius: ".75rem",
              //         width: "100%",
              //         justifyContent: "space-evenly",
              //         height: "175px",
              //         padding: "10px",
              //       }}
              //     >
              //       <img
              //         style={{
              //           width: "100%",
              //           height: "100%",
              //           objectFit: "cover", // Ensures the image covers the container
              //           borderRadius: "inherit", // Inherit border-radius from the parent div
              //           perspective: "1000px",
              //           boxShadow:
              //             "0 10px 20px rgba(var(--text-color-rgb),0.2)",
              //         }}
              //         src={
              //           "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.5Odr4ONJ2l_A-WC0TrLAHgHaEH%26pid%3DApi&f=1&ipt=41397a86a412633eb456f55238791375242dfd1c744d2e513150500f58f21459&ipo=images"
              //         }
              //       ></img>
              //     </motion.div>
              //     <div
              //       style={{
              //         fontFamily:
              //           "Rubik, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
              //         padding: "20px",
              //       }}
              //     >
              //       <h1>{member.name}</h1>
              //       <p>
              //         <b>{member.desg}</b>
              //       </p>
              //       <p>{member.bio}</p>
              //     </div>
              //   </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AboutUs;
