import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Slide,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Axios from "axios";
import { forwardRef, useContext, useEffect, useState } from "react";
import { AlertContext } from "../common/AlertProvider";
import Navbar from "../common/Navbar";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ViewSubmissions = () => {
  //   const contestId = parseInt(useParams()["id"] || "");
  //   const { user } = useAuth()!;
  const [users, setUsers] = useState<any>([]);
  const [user, setUser] = useState<any>();
  const [contest, setContest] = useState<any>();
  const [contests, setContests] = useState<any>([]);
  const [problems, setProblems] = useState<any>([]);
  const alert = useContext(AlertContext);
  const [contestEnded, setContestEnded] = useState<any>(null);
  const [userEnded, setUserEnded] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [subCode, setsubCode] = useState("");

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  useEffect(() => {
    (async () => {
      Axios.get(`/api/contest/all`, { withCredentials: true }).then(
        ({ data }) => {
          setContests(data);
        }
      );
      Axios.get(`/api/users/all`, { withCredentials: true }).then(
        ({ data }) => {
          setUsers(data);
        }
      );

      //   let { data } = await Axios.get(`/api/users/all`);
    })();
  }, []);
  const handleClickOpen = (submissionId: any) => {
    Axios.get(`/api/problem/user/submission?submissionId=${submissionId}`)
      .then(({ data }) => {
        console.log(data);
        setsubCode(data);
      })
      .catch((_e) => {
        // alert(e+'in show code')
        setsubCode("Couldn't load submission code");
      })
      .finally(() => {
        setOpen(true);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };
  // const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div style={{ width: "100%", position: "relative" }}>
        <Card
          sx={{ maxWidth: "1000px", margin: "50px auto", padding: "50px 10px" }}
          variant="outlined"
        >
          <div
            style={{
              fontSize: "25px",
              textAlign: "center",
              fontFamily: '"M PLUS Rounded 1c", sans-serif',
              margin: "auto 100px",
              fontWeight: 600,
            }}
          >
            View Submissions
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Autocomplete
              // value={user}
              onChange={(event:any, newValue: any) => {
                setUser(newValue);
                event
              }}
              getOptionLabel={(option) => {
                return option.id + ". " + option.username;
              }}
              id="contest-autocomplete-component"
              options={users}
              sx={{ width: 300, margin: "10px" }}
              renderInput={(params) => <TextField {...params} label="User" />}
            />
            <Autocomplete
              // value={contest}
              onChange={(event: any, newValue: any) => {
                setContest(newValue);
                event
              }}
              getOptionLabel={(option) => {
                return option.id + ". " + option.title;
              }}
              id="contest-autocomplete-component"
              options={contests}
              sx={{ width: 300, margin: "10px" }}
              renderInput={(params) => (
                <TextField {...params} label="Contest" />
              )}
            />
            <Button
              onClick={async () => {
                Axios.get(
                  `/api/problem/all/submissions?contestId=${contest.id}&userId=${user.id}`,
                  { withCredentials: true }
                )
                  .then(({ data }) => {
                    console.log(data.userState)
                    if (data.problems.length == 0)
                      alert?.showAlert("No Results to display", "error");
                    if(data.userState<0) {
                      alert?.showAlert("User not registred for contest", "error");
                      setUserEnded(null);
                    setContestEnded(null);
                    } else {
                    setUserEnded(data.userState);
                    setContestEnded(data.contestState);
                  }
                    setProblems(data.problems);
                    console.log(data.problems);
                  })
                  .catch(() =>
                    alert?.showAlert("Couldn't fetch data right now", "error")
                  );
              }}
              size="medium"
              variant="contained"
            >
              Search
            </Button>
          </div>
        </Card>
        <Card
          sx={{ maxWidth: "1000px", margin: "50px auto", padding: "50px 10px" }}
          variant="outlined"
        >
          <div
            style={{
              fontSize: "20px",
              textAlign: "center",
              fontFamily: '"M PLUS Rounded 1c", sans-serif',
              // margin: "auto 100px",
              fontWeight: 600,
            }}
          >
            Results
          </div>
          {problems.length == 0 ? (
            <div
              style={{ padding: "100px", margin: "auto", width: "max-content" }}
            >
              {" "}
              No Results to display
            </div>
          ) : (
            problems.map((problem: any, index: number) => (
              <div style={{ margin: "auto", width: "max(400px, 80%)" }}>
                <Accordion
                  // onClick={() => {
                  //   console.log("Noo.....");
                  //   return;
                  //   navigate(`/code/${problemId}`);
                  // }}
                  variant="outlined"
                  sx={{
                    fontFamily: "sans-serif",
                    // margin: "auto",
                    // width: "80%",
                    // marginY: "10px",
                  }}
                  key={problem.id}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: 0,
                        padding: 10,
                      }}
                    >
                      <div>
                        <Typography sx={{ paddingBottom: 1 }}>
                          {index + 1}. {problem.title} {"\n"}
                        </Typography>
                        {/* <Typography fontSize={11}>
                      <b>Max Score:</b> {maxscore}
                    </Typography> */}
                      </div>
                    </div>
                  </AccordionSummary>
                  {/* <Divider/> */}
                  <AccordionDetails>
                    <Typography>Submissons:</Typography>
                    <List>
                      {problem.submissions && problem.submissions.map(
                        (
                          submission: {
                            id: string;
                            verdect: string;
                            score: string;
                            createdAt: string;
                          },
                        ) => {
                          return (
                            <ListItem>
                              <ListItemText
                                primary={`Verdect : ${submission.verdect}`}
                              />
                              <ListItemText
                                primary={`Score: ${submission.score}`}
                              />
                              <ListItemText
                                primary={`Submission Time: ${submission.createdAt}`}
                              />
                              <Button
                                variant="contained"
                                onClick={() => handleClickOpen(submission.id)}
                              >
                                View Code
                              </Button>
                              <Dialog
                                fullScreen={fullScreen}
                                open={open}
                                TransitionComponent={Transition}
                                onClose={handleClose}
                                aria-labelledby="responsive-dialog-title"
                              >
                                <DialogTitle id="responsive-dialog-title">
                                  {"Code"}
                                </DialogTitle>
                                <DialogContent>
                                  <Card
                                    sx={{
                                      fontSize: 14,
                                      // width: "90%",
                                      marginTop: 1,
                                      whiteSpace: "preserve",
                                      padding: 1,
                                      fontFamily:
                                        "Consolas, 'Courier New', monospace",
                                    }}
                                    variant="outlined"
                                  >
                                    {subCode}
                                  </Card>
                                </DialogContent>
                              </Dialog>
                            </ListItem>
                          );
                        }
                      )}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </div>
            ))
          )}
           <div style={{width:'max-content', margin:'auto', marginTop: '30px'}}>{contestEnded==null?<></>:<div> {(contestEnded=="manualactive" || contestEnded == "active")?(userEnded?<>{"User has submitted"}<Button color="error" variant="contained" sx={{marginInline:'20px'}}>Unsubmit</Button></>:<>{"Users hasn't submitted"}<Button color="error" variant="contained" sx={{marginInline:'20px'}}>Submit</Button></>):"Contest has ended"}</div>}</div>
        </Card>
      </div>
    </div>
  );
};

export default ViewSubmissions;
