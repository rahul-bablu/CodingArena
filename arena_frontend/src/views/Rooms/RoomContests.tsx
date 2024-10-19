import { LaunchOutlined } from "@mui/icons-material";
import { Button, Card, Grow, Typography } from "@mui/material";
import Axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../components/Auth/AuthProvider";
import { AlertContext } from "../../components/common/AlertProvider";
import Navbar from "../../components/common/Navbar";
import { LableTitle } from "../Contests/common";

const RoomContests = () => {
  const { userObj } = useAuth()!;
  const [data, setData] = useState<any>();
  const alert = useContext(AlertContext);
  const navigate = useNavigate();

  const roomName = useParams()["roomName"] || "";
  async function handleRegister(contestId: number) {
    try {
      const { data, status } = await Axios.post(
        `/api/contest/adduser`,
        { userId: userObj?.id, contestId: contestId },
        { withCredentials: true }
      );
      if (status == 200) {
        alert?.showAlert(data.message, "success");
        window.location.reload();
      }
      alert?.showAlert(data, "warning");
    } catch (e: any) {
      alert?.showAlert(e.response.data, "error");
    }
  }
  const getRoomDetails = async () => {
    try {
      const { data } = await Axios.get(`/api/room/name/${roomName}`);
      setData(data);
    } catch (e: any) {
      alert?.showAlert(e.response.data.message, "error");
      navigate("/go-to-not-found-trigger-ad3df4"); // for now
    }
  };
  useEffect(() => {
    getRoomDetails();
  }, []);
  return (
    <>
      <Navbar />
      <div>
        {data && data.contests && (
          <>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                maxWidth: "1000px",
                margin: "0px auto",
                position: "relative",
                minHeight: "200px",
              }}
            >
              {/* <CurrentContest qs={(data.contests.filter((item: any) => item.registred && item.state != "end"))} /> */}
              {/* <div
                style={{
                  width: "100%",
                  position: "relative",
                  minHeight: "200px",
                }}
              > */}
                <LableTitle title="Choose a set" />
                {data.contests.length == 0 ? (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    No contests in room
                  </div>
                ) : (
                  data.contests.map(
                    (
                      {
                        title,
                        id,
                        registred,
                      }: {
                        title: string;
                        id: number;
                        registred: boolean;
                        endTime: string;
                        startTime: string;
                        state: string;
                        uended: boolean;
                      },
                      index: number
                    ) => (
                      <Grow in={true} timeout={900}>
                        <Card
                          variant="outlined"
                          sx={{
                            fontFamily: "sans-serif",
                            margin: "auto",
                            width: "450px",
                            marginY: "10px",
                            maxWidth: "1000px",
                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
          
                          }}
                          key={id}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              flexDirection: 'column',
                              margin: 0,
                              padding: 20,
                              paddingTop: 25,
                            }}
                          >
                            <div>
                              <Typography sx={{ paddingBottom: 1 }}>
                                {index + 1}. {title} {"\n"}
                                {/* {"Set " + (index + 1)} */}
                              </Typography>
                            </div>
                            <div>
                              {registred ? (
                                <Button
                                  variant="contained"
                                  onClick={() => navigate(`/test/${id}`)}
                                >
                                  Enter
                                </Button>
                              ) : (
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  onClick={() => handleRegister(id)}
                                >
                                  Register
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      </Grow>
                    )
                  )
                )}
              </div>
            {/* </div> */}
          </>
        )}
        <div style={{margin: 'auto', width: '200px', justifyContent: 'space-evenly', display: 'flex'}}>
        <Button
              sx={{
                paddingInline: "20px",
                paddingBlock: "10px",
                marginBlock: "10px",
              }}
              variant="outlined"
              onClick={() => navigate("/rooms/leaderboard/1")}
            >
              {" "}
              <b style={{paddingInline: '10px'}}>
                View result
                </b>
                <LaunchOutlined />
            </Button>
        </div>
        {/* <pre>{JSON.stringify(data, null, 5)}</pre> */}
      </div>
    </>
  );
};

export default RoomContests;
