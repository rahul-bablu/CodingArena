import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Button, Card, Grow, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, LableTitle } from "./common";

const Timer = ({ deadline }: { deadline: string }) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);


  const getTime = (deadline: string) => {
    const time = Math.max(Date.parse(deadline) - Date.now(), 0);
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
        alignItems: "baseline",
        textAlign: "center",
        // border: "2px solid #AAAA",
        // width: "115px",
      }}
    >
      <AccessTimeIcon
        fontSize="medium"
        sx={{ paddingInline: "5px", transform: "translate(0px, 2px)" }}
      />
      <p>
        {" "}
        Starts in {days < 10 ? "0" + days : days}d{" "}
        {hours < 10 ? "0" + hours : hours}h{" "}
        {minutes < 10 ? "0" + minutes : minutes}m{" "}
        {seconds < 10 ? "0" + seconds : seconds}s
      </p>
    </div>
  );
};

export const CurrentContest = ({ qs }: { qs: any[] }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >
      <LableTitle title="Current Contest" />
      {
        qs.map(
          ({
            title,
            id,
            startTime,
            state,
            uended,
          }: {
            title: string;
            id: number;
            endTime: string;
            registred: boolean;
            startTime: string;
            state: string;
            uended: boolean;
          }) => (
            <Grow in={true} timeout={900}>
              <Card
                // variant="outlined"
                sx={{
                  fontFamily: "sans-serif",
                  margin: "auto",
                  width: "450px",
                  marginY: "10px",
                  transition: "box-shadow 0.3s",
                  "&:hover": {
                    boxShadow: 6,
                  },
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
                    paddingTop: 25,
                  }}
                >
                  <div>
                    {state == "inactive" ? (
                      <Timer deadline={startTime} />
                    ) : state == "manualactive" ? (
                      <Badge value="Live" />
                    ) : state == "manual" ? (
                      <code style={{ backgroundColor: "blue" }}>
                        YET TO Start
                      </code>
                    ) : (
                      <></>
                    )}
                    <Typography
                      sx={{
                        paddingBlock: 1,
                        fontWeight: 600,
                        fontSize: "18px",
                      }}
                    >
                      {title} {"\n"}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"M PLUS Rounded 1c", sans-serif',
                        fontSize: "14px",
                      }}
                    >
                      {dayjs(startTime).format("dddd, MMMM D, YYYY h:mm A")}
                    </Typography>
                  </div>
                  {uended ? (
                    <Button size="small" variant="outlined" disabled>
                      Submited
                    </Button>
                  ) : state === "inactive" &&
                    Date.parse(startTime) - Date.now() > 0 ? (
                    <Timer deadline={startTime} />
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/test/${id}`)}
                    >
                      Enter
                    </Button>
                  )}
                </div>
              </Card>
            </Grow>
          )
        )
        // JSON.stringify(qs)
      }
    </div>
  );
};
