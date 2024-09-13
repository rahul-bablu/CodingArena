import LaunchIcon from "@mui/icons-material/Launch";
import { Button, Card, Grow, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LableTitle } from "./common";

export const PastContest = ({ qs }: { qs: any[] }) => {
  const navigate = useNavigate();
  return (
    <div style={{ width: "100%", minHeight: "200px", position: "relative" }}>
      <LableTitle title="Past Contests" />
      {qs.length == 0 ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          No past contests
        </div>
      ) : (
        <></>
      )}
      {qs.map(
        (
          {
            title,
            id,
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
                  <Button onClick={() => navigate(`/leaderboard/${id}`)}>
                    View Leaderboard <LaunchIcon />
                  </Button>
                </div>
              </div>
            </Card>
          </Grow>
        )
      )}
    </div>
  );
};
