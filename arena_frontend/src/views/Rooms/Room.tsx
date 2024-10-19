import { Box, Button, TextField } from "@mui/material";
import Axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../../components/common/AlertProvider";
import Navbar from "../../components/common/Navbar";

const Room = () => {
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const alert = useContext(AlertContext);
  const navigate = useNavigate();
  const handleEnterRoom = async () => {
    try {
      const { data } = await Axios.post("/api/room/user", {
        roomName,
        roomCode,
      });
      alert?.showAlert(data.message, "success");
      navigate(`/rooms/${roomName}`);
    } catch (e: any) {
      alert?.showAlert(e.response.data.message, "error");
    }
  };
  return (
    <>
      <Navbar />
      <Box
        // display="grid"
        // justifyContent="center"
        // alignContent="center"

        // minHeight="100vh"
        // width={"100vw"}
        gap={"10px"}
      >
        <div
          style={{
            paddingBlock: '30px',
            gap: '10px',
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            // background: "white",
            minWidth: "300px",
            maxWidth: "900px",
            width: "60%",
            margin: "auto",
            borderRadius: ".5rem",
            top: "50%",
            position: "absolute",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
          }}
        >
          <div style={{fontWeight: 700, fontSize: '2.5rem', }}>
          Room
          </div>
          {/* <div style={{width: '80%', maxWidth: '600px', margin: 'auto'}}> */}
          <TextField
            id="outlined-multiline-static"
            label="Enter Name"
            onChange={(e) => setRoomName(e.target.value)}
            required
            //   variant="outlined"
            sx={{ width: "80%", maxWidth: "600px" }} // 80% width, max width of 600px
          />

          {/* </div> */}
          {/* <div style={{width: '80%', maxWidth: '600px', margin: 'auto'}}> */}
          <TextField
            id="outlined-multiline-static"
            label="Enter Code"
            variant="outlined"
            onChange={(e) => setRoomCode(e.target.value)}
            required
            sx={{ width: "80%", maxWidth: "600px" }} // 80% width, max width of 600px
          />
          {/* </div>
      <div style={{width: '80%', maxWidth: '600px', margin: 'auto'}}> */}

          <Button variant="contained" onClick={handleEnterRoom}>Enter room</Button>
          {/* </div> */}
        </div>
      </Box>
    </>
  );
};

export default Room;
