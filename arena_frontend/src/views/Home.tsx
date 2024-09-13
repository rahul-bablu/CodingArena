import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grow,
  Typography
} from "@mui/material";
import Axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../components/common/AlertProvider";
import Navbar from "../components/common/Navbar";

const Home = () => {
  const [qs, setQs] = useState<any>(null);
  const alert = useContext(AlertContext);
  const [notAttempted, setNotAttempted] = useState(false);
  const [showAttempted, setShowAttempted] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const { data } = await Axios.get(`/api/problem?contestId=1`);
        setQs(data);
        alert?.showAlert("Welcome Back Coder!", "info");
      } catch (e) {
        alert?.showAlert("Couldn't load questions", "error");
      }
    })();
  }, []);

  return (
    <>
      <Navbar />
      <Box display={"flex"} flexWrap={"wrap-reverse"}>
        <div style={{ width: "max(60%, 250px)", margin: "auto" }}>
          {qs ? (
            qs
              .filter((obj: any) => {
                if (!showAttempted && !notAttempted) return obj;
                if (showAttempted && obj.attempted) return obj;
                if (notAttempted && !obj.attempted) return obj;
                return null;
              })
              .map(
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
                    attempted: boolean;
                  },
                  index: number
                ) => {
                  return (
                    <Grow in={true} timeout={200 * (index + 1)}>
                      <Card
                        onClick={() => {
                          navigate(`/code/${problemId}`);
                        }}
                        variant="outlined"
                        sx={{
                          fontFamily: "sans-serif",
                          margin: "auto",
                          width: "90%",
                          marginY: "10px",
                          minWidth: "250px",
                        }}
                        key={problemId}
                      >
                        <div
                          style={{
                            display: "flex",
                            // width: "100%",
                            flexWrap: "wrap",
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
                              // width: ''
                            }}
                          >
                            <Button
                              sx={{ marginInline: 4 }}
                              size="large"
                              style={{ width: "170px" }}
                              color="success"
                              variant={!attempted ? "contained" : "outlined"}
                              onClick={async (e) => {
                                navigate(`/code/${problemId}`);
                                e.stopPropagation();
                                e.preventDefault();
                                //   const { data } = await Axios.delete(
                                //     `/api/problem/${problemId}`
                                //   );
                                //   alert(JSON.stringify(data));
                                //   setReload(!reload);
                              }}
                            >
                              {solved
                                ? "Solved"
                                : attempted
                                ? "Try Again"
                                : "Solve"}
                            </Button>
                          </div>
                        </div>
                        {/* <Divider/> */}
                      </Card>
                    </Grow>
                  );
                }
              )
          ) : (<></>
          )}
        </div>
        <div style={{ margin: "0 auto" }}>
          <div
            style={{
              position: "sticky",
              margin: "auto",
              top: 15,
              height: "max-content",
              width: "250px",
            }}
          >
            <Card
              sx={{
                paddingInline: "20px",
                paddingBlock: "10px",
                marginBlock: "10px",
              }}
              onClick={() => navigate("leaderboard/1")}
            >
              {" "}
              View Leaderboard
            </Card>

            <Card
              sx={{
                padding: "25px",

                display: "flex",
                alignItems: "center",
              }}
            >
              <div>
                <FormControlLabel
                  value="not Attempted"
                  control={
                    <Checkbox
                      checked={notAttempted}
                      onChange={(e) => setNotAttempted(e.target.checked)}
                    />
                  }
                  label="Not Attempted"
                />
                <FormControlLabel
                  value="not accepted"
                  control={
                    <Checkbox
                      checked={showAttempted}
                      onChange={(e) => setShowAttempted(e.target.checked)}
                    />
                  }
                  label="Attempted"
                />
              </div>
            </Card>
          </div>
        </div>
      </Box>
    </>
  );
};

export default Home;
