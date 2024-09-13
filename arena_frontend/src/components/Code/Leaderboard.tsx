import {
  Box,
  Button,
  Card,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../common/Navbar";

interface Problem {
  id: number;
  title: string;
  UserProblems: {
    score: number;
  };
}

interface User {
  id: number;
  username: string;
  totalScore: number;
  Problems: Problem[];
}

interface LeaderboardProps {
  data: User[];
}

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TransitionProps } from "@mui/material/transitions";
import { useAuth } from "../Auth/AuthProvider";

interface Problem {
  id: number;
  title: string;
  UserProblems: {
    score: number;
  };
}

interface User {
  id: number;
  username: string;
  totalScore: number;
  Problems: Problem[];
}

interface LeaderboardProps {
  data: User[];
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function ShowCode({
  userId,
  problemId,
}: {
  userId: number;
  problemId: number;
}) {
  const {userObj} = useAuth()!;
  console.log(useAuth())
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [subCode, setsubCode] = useState("");

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    Axios.get(
      `/api/problem/user/submission?userId=${userId}&problemId=${problemId}`
    ).then(({data}) => {console.log(data); setsubCode(data)}).catch((_e)=>{
      // alert(e+'in show code')
      setsubCode("Couldn't load submission code");
    }).finally(()=>{setOpen(true)});
    
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    // console.log(userObj)
  }, []);

  return (
    <>
      <Button
        sx={{ margin: "auto", width: 90 }}
        onClick={handleClickOpen}
        color="success"
        variant="contained"
        size="small"
        disabled={userId.toString()!=userObj!.id && userObj?.role == 'user'} // TODO: handle
      >
        Show code
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
              width: "90%",
              marginTop: 1,
              whiteSpace: "preserve",
              padding: 1,
              fontFamily: "Consolas, 'Courier New', monospace",
            }}
            variant="outlined"
          >
            {subCode}
          </Card>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="success" variant="contained">
            <Add/>
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
}

const LeaderboardTable: React.FC<LeaderboardProps> = ({ data }) => {
  const [openUserId, setOpenUserId] = useState<number | null>(null);

  const handleToggle = (userId: number) => {
    setOpenUserId(openUserId === userId ? null : userId);
  };

  return (
    <Box sx={{ padding: 2, maxWidth: "1024px", margin: "auto" }}>
      <div style={{marginInline: 'auto', width:'max-content'}}><Typography variant="h4" gutterBottom >
        Leaderboard
      </Typography></div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Rank</b>
              </TableCell>
              {/* <TableCell><b>User ID</b></TableCell> */}
              <TableCell>
                <b>Username</b>
              </TableCell>
              <TableCell>
                <b>Total Score</b>
              </TableCell>
              <TableCell>
                <b>More</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((user, index) => (
              <React.Fragment key={user.id}>
                <TableRow>
                  <TableCell>{index + 1}</TableCell>
                  {/* <TableCell>{user.id}</TableCell> */}
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.totalScore}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleToggle(user.id)}>
                      {openUserId === user.id ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={5} style={{ padding: 0 }}>
                    <Collapse
                      in={openUserId === user.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={1}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              {/* <TableCell>Problem ID</TableCell> */}
                              <TableCell>
                                <b>Problem</b>
                              </TableCell>
                              <TableCell>
                                <b>Score</b>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {user.Problems.map((problem) => (
                              <TableRow key={problem.id}>
                                {/* <TableCell>{problem.id}</TableCell> */}
                                <TableCell>{problem.title}</TableCell>
                                <TableCell>
                                  {problem.UserProblems.score}
                                </TableCell>
                                <TableCell>
                                  <ShowCode
                                    problemId={problem.id}
                                    userId={user.id}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const Leaderbord = () => {
  const [qs, setQs] = useState<User[]>([]);
  const { id: contestId } = useParams()!;
  useEffect(() => {
    (async () => {
      const { data } = await Axios.get(`/api/contest/leaderbord/${contestId}`);
      console.log(data);
      setQs(data);
    })();
  }, []);

  return (
    <>
      <Navbar />
      <LeaderboardTable data={qs} />
    </>
  );
};

export default Leaderbord;
