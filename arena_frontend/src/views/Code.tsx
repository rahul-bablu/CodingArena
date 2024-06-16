import AlarmIcon from "@mui/icons-material/Alarm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import {
  Box,
  Button,
  Card,
  IconButton,
  Popper,
  Tooltip
} from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { DataGrid } from "@mui/x-data-grid";
import Axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import Console from "../components/Code/Console";
import Question from "../components/Code/Question";
import { Editor } from "../components/Editor/Editor";
import "../components/Editor/useWorker";
import { AlertContext } from "../components/common/AlertProvider";
import Navbar from "../components/common/Navbar";
import "./Code.module.css";

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
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        display: "flex",
        borderRadius: 10,
        fontSize: 14,
        alignItems: "center",
        textAlign: "center",
        border: "2px solid #AAAA",
        width: "max-content",
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

function SimplePopper() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 10 }}>
      <Button
        aria-describedby={id}
        color="info"
        variant="contained"
        size="small"
        onClick={handleClick}
        style={{ borderRadius: "50%", width: 60, height: 60 }}
      >
        {open ? <CloseIcon /> : <AlarmIcon />}
      </Button>
      <Popper id={id} open={open} anchorEl={anchorEl} placement="top-end">
        <Timer deadline="December, 31, 2024" />
      </Popper>
    </div>
  );
}

import Confetti from "react-confetti";
const Code = () => {
  // TODO: Handle NaN
  const problemId = parseInt(useParams()["id"] || "");
  const alert = useContext(AlertContext);
  const navigate = useNavigate();
  const [sizes, setSizes] = useState(["35%", "65%"] as (string | number)[]);
  const [hsizes, setHsizes] = useState(["80%", "20%"] as (string | number)[]);

  const [submissions, setSubmissions] = useState<any>([]);
  let [language, setLanguage] = useState(
    () => localStorage.getItem("current-lang") || "c"
  );
  const [confettiActive, setConfettiActive] = useState<boolean>(false);
  const getSubmissions = async () => {
    try {
      // const { data } = await Axios.get(`/api/problem/${id}`);
      // Axios.defaults.withCredentials = true;
      Axios(`/api/problem/submissions/${problemId}`, {
        method: "GET",
        // withCredentials: true,
      })
        .then(({ data }) => {
          console.log(data);
          setSubmissions(data || []);
        })
        .catch((_e) => alert?.showAlert("Couldn't load submissions", "error"));
      // console.log(data.q)
    } catch (e) {
      console.log(e);
      alert?.showAlert("Couldn't load submissions", "error");
    }
  };

  useEffect(() => {
    getSubmissions();
  }, []);
  const [tab, setTab] = useState(1);

  const Submissions = useMemo(
    () =>
      !submissions ? (
        <div style={{ width: "max-content", margin: "auto" }}>
          No Submissions yet
        </div>
      ) : (
        <DataGrid
          getRowId={(row: any) => row.createdAt}
          columns={[
            { field: "verdect", headerName: "Verdect", width: 100 },
            { field: "score", headerName: "Score", width: 60 },
            {
              field: "createdAt",
              headerName: "Submission Time",
              width: 200,
            },
          ]}
          rows={submissions}
          disableRowSelectionOnClick
          pageSizeOptions={[5]}
          autoHeight
          // slots={{
          //   noRowsOverlay: () => (
          //     <Box
          //       display="flex"
          //       justifyContent="center"
          //       alignItems="center"
          //       height={"90%"}
          //     >
          //       No Submissions
          //     </Box>
          //   ),
          // }}
          // sx={{ "--DataGrid-overlayHeight": "300px" }}
        />
      ),
    [submissions]
  );
  function onValueChange(value: string, language: string) {
    let storageData = JSON.parse(
      localStorage.getItem("autoSavedCodes") || "{}"
    );

    // Ensure the structure exists
    if (!storageData[problemId]) {
      storageData[problemId] = {};
    }

    storageData[problemId][language] = value;

    // Save the updated data back to local storage
    localStorage.setItem("autoSavedCodes", JSON.stringify(storageData));
    // localStorage.setItem("current_content", value);
  }

  return (
    <div
      style={{
        height: "100vh",
        minWidth: 500,
        overflow: "auto",
        backgroundColor: "rgb(250,250,250)",
      }}
    >
      <Navbar />
      {/* <Fab sx={{position:'fixed', bottom:20, right:20}} color="info" aria-label="edit" onClick={()=>{}}>
        <AlarmIcon/>
      </Fab> */}
      {confettiActive && <Confetti width={window.innerWidth} />}
      <div>
        <SimplePopper />
      </div>
      <div style={{ height: "calc(100vh - 50px)" }}>
        {/* <div style={{height:100}}></div> */}
        <SplitPane
          split="vertical"
          sizes={sizes}
          onChange={setSizes}
          sashRender={undefined}
          //   resizerSize={5}
        >
          <Pane minSize={100} maxSize="50%" style={{ height: "100%" }}>
            {/* TODO: Code Refactoring */}
            {/* <Slide in direction="right" timeout={1000}> */}
            <Card
              sx={{
                height: "100%",
                margin: "5px 2px 5px 10px",
                overflowY: "auto",
              }}
              variant="outlined"
            >
              <div
                style={{ width: "10%", marginLeft: 15 }}
                onClick={() => navigate(-1)}
              >
                <ArrowBackIcon
                  fontSize="large"
                  sx={{ padding: 1, paddingBottom: 0, display: "inline-block" }}
                />
                {/* <Timer /> */}
              </div>
              <div style={{ width: "100%" }}>
                <Box
                  sx={{
                    width: "100%",
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <Tabs
                    onChange={(_e, t) => setTab(t)}
                    aria-label="Problem and submissions lables"
                    value={tab}
                    // style={{display: 'inline-block', justifyContent: 'space-around'}}
                    variant="fullWidth"
                  >
                    <Tab label="Problem" value={1} />
                    <Tab label="Submissions" value={2} />
                  </Tabs>
                </Box>
                <Question id={problemId} hidden={tab != 1} />
                <div hidden={tab != 2}>
                  <div style={{ margin: "auto", width: "max-content" }}>
                    <Tooltip title="Reload Submissions">
                      <IconButton onClick={getSubmissions}>
                        <ReplayIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                  {/* {submissions.map(
                      ({
                        verdect,
                        score,
                        createdAt,
                      }: {
                        verdect: string;
                        score: number;
                        createdAt: string;
                      }, index: any) => {
                        return <ListItem key={"This need to be changed"+index}>
                        <ListItemText>{verdect}</ListItemText>
                        <ListItemText>{score}</ListItemText>
                        <ListItemText>{createdAt}</ListItemText>
                      </ListItem>;
                        
                    }) } */}

                  {Submissions}
                </div>
              </div>
            </Card>
            {/* </Slide> */}
          </Pane>
          <SplitPane
            split="horizontal"
            sizes={hsizes}
            onChange={setHsizes}
            sashRender={undefined}
          >
            {/* <Slide in direction="down" timeout={1000}> */}
            <div
              style={{
                height: "100%",
                border: "1px solid rgb(250,210,210)",
                backgroundColor: "white",
                borderRadius: "5px",
                marginTop: "5px",
              }}
            >
              <Editor
                language={language}
                setLanguage={setLanguage}
                problemId={problemId}
                // getStater={getStater}
                // initValue={
                //   getStater(language)}
                onValueChange={onValueChange}
              />
            </div>
            {/* </Slide> */}
            {/* <Slide  in direction="up" timeout={1000}> */}
            <Console
              id={problemId}
              language={language}
              setConfettiActive={setConfettiActive}
            />
            {/* </Slide> */}
          </SplitPane>
        </SplitPane>
      </div>
    </div>
  );
};

export default Code;
