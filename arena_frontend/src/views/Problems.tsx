import { Box, Button, Card, Typography } from "@mui/material";
import Axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertContext } from "../components/common/AlertProvider";
import Navbar from "../components/common/Navbar";

// const Timer = ({ deadline,  type}: { deadline: string, type:'start'|'end' }) => {
//   deadline;type;
//   // const [days, setDays] = useState(0);
//   // const [hours, setHours] = useState(0);
//   // const [minutes, setMinutes] = useState(0);
//   // const [seconds, setSeconds] = useState(0);

//   // const deadline = ;

//   // const getTime = (deadline: string) => {

//   //   const time = Math.max((type == 'end'?Date.parse(deadline) - Date.now():Date.now() - Date.parse(deadline)), 0);
//   //   // setTimeLeft(time);
//   //   setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
//   //   setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
//   //   setMinutes(Math.floor((time / 1000 / 60) % 60));
//   //   setSeconds(Math.floor((time / 1000) % 60));
//   // };

//   // useEffect(() => {
//   //   const interval = setInterval(() => getTime(deadline), 1000);

//   //   return () => clearInterval(interval);
//   // }, []);
// return <></>
//   // return (
//   //   <div
//   //     className="timer"
//   //     role="timer"
//   //     style={{
//   //       // backgroundColor: "rgba(255, 255, 255, 0.7)",
//   //       display: "flex",
//   //       // borderRadius: 10,
//   //       fontSize: 14,
//   //       alignItems: "baseline",
//   //       textAlign: "center",
//   //       // border: "2px solid #AAAA",
//   //       // width: "115px",
//   //     }}
//   //   >
//   //     <AccessTimeIcon
//   //       sx={{ margin: 0, padding: 0, transform: "translate(0px, 5px)" }}
//   //     />
//   //     <p>
//   //       {" "}
//   //       {days < 10 ? "0" + days : days}d{" "}
//   //       {hours < 10 ? "0" + hours : hours}h{" "}
//   //       {minutes < 10 ? "0" + minutes : minutes}m{" "}
//   //       {seconds < 10 ? "0" + seconds : seconds}s
//   //     </p>
//   //   </div>
//   // );
// };

/*
  This Page displays the problems of specified contest by contestId
*/

const Problems = () => {
  const contestId = parseInt(useParams()["id"] || "");
  // TODO: Handle NaN
  const [qs, setQs] = useState<any>([]);
  const [contestTitle, setContestTitle] = useState("");
  // const [startTime, setStartTime] = useState('');
  // const [endTime, setEndTime] = useState('');
  // const [state, setState] = useState('');
  const alert = useContext(AlertContext);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const { data } = await Axios.get(
          `/api/contest/problems/user?contestId=${contestId}`
        );
        setQs(data.problems);
        // console.log(data);
        // setStartTime(data.startTime);
        // setEndTime(data.endTime);
        // setState(data.state);
        setContestTitle(data.title);
      } catch (e: any) {
        alert?.showAlert(e.response.data.message, "error");
        navigate("/contests");
      }
    })();
  }, []);

  return (
    <div>
      <Navbar />
      <Box display={"flex"}>
        <div style={{ width: "80%", margin: "auto" }}>
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px'}}>
            <Typography fontSize={"2rem"}>{contestTitle}</Typography><Card
              sx={{
                paddingInline: "20px",
                paddingBlock: "10px",
                marginBlock: "10px",
              }}
              onClick={() => navigate(`/leaderboard/${contestId}`)}
            >
              {" "}
              View Leaderboard
            </Card>
            </div>
            {/* <div style={{display: 'flex' , alignItems: 'center', gap: '6px'}}>

            {state == 'active' && endTime? <>{"Ends in: "}<Timer deadline={endTime} type={"end"}/></>: <></>} {state == 'manualactive' && startTime?<>{"Started "}<Timer deadline={startTime} type={"start"} /> {" ago"}</>:<></>}
            </div> */}
          </div>
          {qs ? (
            qs.map(
              (
                {
                  title,
                  id: problemId,
                  solved,
                  maxScore,
                  tried,
                  attempted,
                }: {
                  title: string;
                  id: number;
                  solved: boolean;
                  maxScore: number;
                  tried: number;
                  attempted: number;
                },
                index: number
              ) => (
                <Card
                  // onClick={() => {
                  //   console.log("Noo.....");
                  //   return;
                  //   navigate(`/code/${problemId}`);
                  // }}
                  variant="outlined"
                  sx={{
                    fontFamily: "sans-serif",
                    marginY: "10px",
                  }}
                  key={problemId}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: 0,
                      padding: 20,
                      paddingTop: 25,
                    }}
                  >
                    <div>
                      <Typography sx={{ fontSize: 16, paddingBottom: 1 }}>
                        {index + 1}. {title} {"\n"}
                      </Typography>
                      <div style={{ display: "flex" }}>
                        <Typography fontSize={12}>
                          Max Score: <b>{maxScore}</b>
                        </Typography>
                        <Typography fontSize={12} marginInline={"10px"}>
                          Users Tried: <b>{tried}</b>
                        </Typography>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        marginLeft: "auto",
                        marginRight: 0,
                        width: "max(20%, 200px)",
                      }}
                    >
                      <Button
                        sx={{ marginInline: 4, width: "100%" }}
                        color="success"
                        variant={!attempted ? "contained" : "outlined"}
                        onClick={async () => {
                          navigate(`/test/problem/${problemId}`);
                        }}
                        disabled={solved}
                        size="large"
                      >
                        {solved ? "Solved" : attempted ? "Try Again" : "Solve"}
                      </Button>
                    </div>
                  </div>
                  {/* <Divider/> */}
                </Card>
              )
            )
          ) : (
            <div
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                position: "absolute",
              }}
            >
              No Problems to display...
            </div>
          )}
          <div style={{ margin: "auto", width: "max-content" }}>
            <Button
              size="large"
              sx={{ width: "200px" }}
              variant="contained"
              onClick={async () => {
                try {
                  const res = await Axios.post(`/api/users/endcontest`, {
                    contestId: contestId,
                  });
                  navigate("/contests");
                  alert?.showAlert(res.data, "success");
                } catch (e) {
                  console.log(e);
                  alert?.showAlert((e as any).message as string, "error");
                }
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default Problems;
