import { Button, Card, Grow, Typography } from "@mui/material";
import Axios from "axios";
import { useContext } from "react";
import { useAuth } from "../../components/Auth/AuthProvider";
import { AlertContext } from "../../components/common/AlertProvider";
import { LableTitle } from "./common";

export const FeaturedContest = ({ list }: { list: any[] }) => {
  const { userObj } = useAuth()!;
  const alert = useContext(AlertContext);
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
  return (
    <div style={{ width: "100%", position: "relative", minHeight: "200px" }}>
      <LableTitle title="Featured Contests" />
      {list.length == 0 ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          No featured contests
        </div>
      ) : (
        list.map(
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
                  width: "80%",
                  marginY: "10px",
                  maxWidth: "1000px",
                }}
                key={id}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    margin: 0,
                    padding: 20,
                    paddingTop: 25,
                  }}
                >
                  <div>
                    <Typography sx={{ paddingBottom: 1 }}>
                      {index + 1}. {title} {"\n"}
                    </Typography>
                  </div>
                  <div>
                    {registred ? (
                      <Button size="small" variant="outlined" disabled>
                        Registered..
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
  );
};
