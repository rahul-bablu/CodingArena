import {
    Box,
    Button,
    Card,
    Typography,
  } from "@mui/material";
  import Navbar from "../components/common/Navbar";
  import { useEffect, useState } from "react";
  import Axios from "axios";
  import { useNavigate } from "react-router-dom";
  // import { useAuth } from "../components/Auth/AuthProvider";
  
  const Timer = ({ deadline }: { deadline: string }) => {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
  
    // const deadline = ;
  
    const getTime = (deadline: string) => {
      const time = Date.parse(deadline) - Date.now();
  
      setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
    };
  
    useEffect(() => {
      const interval = setInterval(() => getTime(deadline), 1000);
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div
        className="timer"
        role="timer"
        style={{
          // backgroundColor: "rgba(255, 255, 255, 0.7)",
          display: "flex",
          // borderRadius: 10,
          fontSize: 14,
          alignItems: 'center',
          textAlign: "center",
          // border: "2px solid #AAAA",
          width: "115px",
        }}
      >
        <div className="col-4" style={{ width: "25%", float: "left" }}>
          <div
            className="box"
            style={{
              borderRight: "solid 1px rgba(255, 255, 255, 0.2)",
              fontWeight: 300,
              paddingInline: "10px",
            }}
          >
            <p id="day">{days < 10 ? "0" + days : days}</p>
            {/* <span className="text">Days</span> */}
          </div>
        </div>
        :
        <div className="col-4" style={{ width: "25%", float: "left" }}>
          <div
            className="box"
            style={{
              borderRight: "solid 1px rgba(255, 255, 255, 0.2)",
              fontWeight: 300,
              paddingInline: "10px",
            }}
          >
            <p id="hour">{hours < 10 ? "0" + hours : hours}</p>
            {/* <span className="text">Hours</span> */}
          </div>
        </div>
        :
        <div className="col-4" style={{ width: "25%", float: "left" }}>
          <div
            className="box"
            style={{
              borderRight: "solid 1px rgba(255, 255, 255, 0.7)",
              fontWeight: 300,
              paddingInline: "10px",
            }}
          >
            <p id="minute">{minutes < 10 ? "0" + minutes : minutes}</p>
            {/* <span className="text">Minutes</span> */}
          </div>
        </div>
        :
        <div className="col-4" style={{ width: "25%", float: "left" }}>
          <div
            className="box"
            style={{
              borderRight: "solid 1px rgba(255, 255, 255, 0.2)",
              fontWeight: 300,
              paddingInline: "10px",
            }}
          >
            <p id="second">{seconds < 10 ? "0" + seconds : seconds}</p>
            {/* <span className="text">Seconds</span> */}
          </div>
        </div>
      </div>
    );
  };
  

  const Contests = () => {
    // const [qs, setQs] = useState<any>([
    //   { title: "This should not appier", id: 0 },
    // ]);
    const [qs, setQs] = useState<any>([]);
    // const { user } = useAuth()!;
  
    const navigate = useNavigate();
    useEffect(() => {
      (async () => {
        const { data } = await Axios.get(`/api/contest/user?userId=${1}`, {withCredentials:true});
        // const { data } = await Axios.post(`/api/contest/adduser/1`,{userId:1}, {withCredentials:true});
        // console.log(data)
        setQs(data);
      })();
    }, []);
  
    async function handleRegister() {
      const { data } = await Axios.post(`/api/contest/adduser/1`,{userId:1}, {withCredentials:true});
      console.log(data);
    }
  // console.log(user);
    return (
      <div >
        <Navbar />
        <Box
          display={"flex"}
          // alignItems="center"/
        >
          <div style={{ width: "100%" }}>
            {
              qs.map(
                ({ title, id, registred, startTime, state }: { title: string; id: number, registred:boolean, startTime:string, state: string }, index: number) => (
                  <Card
                    
                    variant="outlined"
                    sx={{
                      fontFamily: "sans-serif",
                      margin: "auto",
                      width: "80%",
                      marginY: "10px",
                    }}
                    key={id}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: 0,
                        padding: 20,
                      paddingTop:25,
                      }}
                    >
                      <div >
                      <Typography sx={{paddingBottom: 1}}>
                        {index + 1}. {title} {"\n"}
                      </Typography>
                      <Typography fontSize={11}>This is a short desc if needed</Typography>
                      </div>
                      {state === "inactive" && (Date.parse(startTime) - Date.now() > 0) ? <Timer deadline={startTime} />: <Button  variant="contained"onClick={() => navigate(`/test/${id}`)} >Enter</Button>}
                      {/* <div>
                        {registred? <Button size="small" variant="outlined" disabled>Registered..</Button>:<Button size="small" variant="contained" color="success" onClick={handleRegister}>Register</Button>}
                      </div> */}
                      {/* <div>
                      <Button size="small" color="info" variant="contained">
                        Edit
                      </Button>
                      <Button sx={{marginInline: 1}} size="small" color="error" variant="contained">
                        Delete
                      </Button>
                      </div> */}
                    </div>
                  </Card>
                )
              )
              // JSON.stringify(qs)
            }
          </div>
          
        </Box>
        {/* <div style={{margin:'auto', width:'80%'}}>
          { user=='user1' || true?<div style={{marginLeft:'auto',marginRight:0, width:100}}><Button sx= {{margin: 'auto', width: 90}} color="success" variant="contained"><Create /></Button></div>:<>Hi</>}
          </div> */}
      </div>
    );
  };
  
  export default Contests;
  