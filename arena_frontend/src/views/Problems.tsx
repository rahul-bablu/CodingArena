import { Box, Button, Card, Typography } from "@mui/material";
import Axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertContext } from "../components/common/AlertProvider";
import Navbar from "../components/common/Navbar";

/*
  This Page displays the problems of specified contest by contestId
*/

const Problems = () => {
  const contestId = parseInt(useParams()["id"] || "");
  // TODO: Handle NaN
  const [qs, setQs] = useState<any>([]);
  const [contestTitle, setContestTitle] = useState("");
  const alert = useContext(AlertContext);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const { data } = await Axios.get(
        `/api/contest/problems/user?contestId=${contestId}`
      );
      setQs(data.problems);
      console.log(data);
      setContestTitle(data.title);
    })();
  }, []);

  return (
    <div>
      <Navbar />
      <Box display={"flex"}>
        <div style={{ width: "80%", margin: "auto" }}>
          <div>
            <Typography fontSize={"2rem"}>{contestTitle}</Typography>
            
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
          <div style={{margin: 'auto', width: 'max-content'}}>
          <Button
          size="large"
          sx={{width: '200px'}}
              variant="contained"
              onClick={async () => {
                try {
                const res = await Axios.post(
                  `/api/users/endcontest?contestId=${contestId}`
                );
                alert?.showAlert(res.data, "success")
              } catch (e ) {
                console.log((e))
                alert?.showAlert((e as any).message as string, "error")
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
