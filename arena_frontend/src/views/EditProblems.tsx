import { Add, Create } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slide,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Axios from "axios";
import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../components/Auth/AuthProvider";
import { AlertContext } from "../components/common/AlertProvider";
import Markdown from "../components/common/Markdown";
import Navbar from "../components/common/Navbar";
import style from "./Problem.module.css";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function ProblemHelper({
  contestId,
  reload,
  setReload,
  initButton,
  problemId,
}: {
  contestId: number;
  problemId?: number | null;
  reload: boolean;
  initButton: React.ReactNode;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const alert = useContext(AlertContext);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [showPreview, setShowPreview] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    
      // console.log(problemId)
    if(problemId)
    (async () => {
      try{
      const { data } = await Axios.get(
        `/api/problem/${problemId}`
      );
      // console.log(data)
      setQ(data.q);
      setTitle(data.title);
    }catch(e) {
      alert?.showAlert("Couldn't loaad problems previous data", 'error')
    }
      
    })();
  
  }, []);

  const handleClickOpen = (e: any) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setReload(!reload);
  };

  const handleSubmit = async () => {
    const { data } =
      problemId == undefined
        ? await Axios.post("/api/problem/create", {
            title,
            contestId,
            q,
            input, 
            output,
          })
        : await Axios.post(`/api/problem/edit/${problemId}`, {
            title,
            q,
          });

    if ("error" in data) {
      // f*ing do something
      
    } else {
      setTitle("");
      setQ("");
      // TODO: SnackBar here
      handleClose();
    }
  };

  return (
    <>
      <div onClick={(e) => {e.preventDefault(); e.stopPropagation();handleClickOpen(e)}}>{initButton}</div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        // aria-labelledby="responsive-dialog-title"
        // style={{maxWidth:'800px'}}
      >
        <DialogTitle id="responsive-dialog-title">{"Add Problem"}</DialogTitle>
        <div >
        <DialogContent sx={{ padding:'15px', paddingRight:'10px'}}>
          <TextField
            sx={{ marginBlock: "10px" }}
            id="title"
            label="Title"
            defaultValue={title}
            variant="outlined"
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            inputProps={{ maxLength: 128 }}
            helperText={`${title?title.length:0}/128`}
          />
          <TextField
            id="Description"
            label="Description"
            // placeholder="Description"
            defaultValue={q}
            onChange={(e) => setQ(e.target.value)}
            fullWidth
            
            multiline
          />
          <TextField
            id="Sample Input"
            label="Sample Input"
            // placeholder="Description"
            defaultValue={input}
            onChange={(e) => setInput(e.target.value)}
            fullWidth
            sx={{ marginBlock: "10px" }}
            inputProps={{ maxLength: 256 }}
            helperText={`${input.length}/256`}
            multiline
          />
          <TextField
            id="Sample Output"
            label="Sample Output"
            // placeholder="Description"
            defaultValue={output}
            onChange={(e) => setOutput(e.target.value)}
            fullWidth
            inputProps={{ maxLength: 256 }}
            helperText={`${output.length}/256`}
            multiline
          />
        </DialogContent>
        <DialogContent sx={{ padding: '15px'}}>
          <Typography>Preview</Typography>
          <div style={{ border: '-1px solid rgb(230,230,230)', height: '70%', width:'90%', borderRadius: '10px', padding:'10px'}}>

          <Markdown   children={q} />
          </div>
        </DialogContent>
        </div>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="success" variant="contained">
            {problemId? 'Edit': 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const FileUpload = ({problemId, handleClose}:{problemId:number, handleClose:()=>void}) => {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputFile, setOutputFile] = useState<File | null>(null);
  const [score, setScore] = useState(0);
  const theme = useTheme();
  const noflex = useMediaQuery(theme.breakpoints.down("sm"));
  const alert = useContext(AlertContext);

  const handleInputFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setInputFile(event.target.files[0]);
    }
  };

  const handleOutputFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setOutputFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputFile && outputFile) {
      const formData = new FormData();
      formData.append("input", inputFile);
      formData.append("output", outputFile);
      formData.append("score", ''+score);
      try {
        const response = await Axios.post(`/api/problem/addIO/${problemId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response);
        alert?.showAlert("Files uploaded successfully", 'success');
        handleClose();
      } catch (error) {
        console.error("Error uploading files", error);
      }
    } else {
      alert?.showAlert("Please select both files.", 'warning');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ margin: "auto", width: "max-content" }}
    >
      <div style={{ margin: "5px" }}>
        <TextField onChange={(e) => setScore(parseInt(e.target.value))} type="number" label="Score" fullWidth></TextField>
      </div>
      <div style={noflex ? {} : { display: "flex" }}>
        <div>
          <input
            className={style.inputFile}
            type="file"
            name="input"
            accept=".txt"
            onChange={handleInputFileChange}
          />
        </div>
        <div>
          <input
            className={style.outputFile}
            type="file"
            name="output"
            accept=".txt"
            onChange={handleOutputFileChange}
          />
        </div>
      </div>
      <div style={{ marginInline: "auto", marginBlock:'5px', width: "max-content" }}>
        <Button type="submit" variant="contained">
          Add
        </Button>
      </div>
    </form>
  );
};

function CreateTextCases({
  problemId,
  reload,
  setReload,
}: {
  problemId: number;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setReload(!reload);
  };

  // const handleSubmit = async () => {
  //   const { data } = await Axios.post("/api/problem/create", {
  //     title,
  //     contestId: id,
  //     q,
  //   });
  //   if ("error" in data) {
  //     // f*ing do something
  //   } else {
  //     setTitle("");
  //     setQ("");
  //     // TODO: SnackBar here
  //     handleClose();
  //   }
  // };

  return (
    <>
      <Button
        sx={{ margin: "auto", width: 30 }}
        // color="success"
        variant="outlined"
        onClick={handleClickOpen}
      >
        <Add />
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Add TestCases"}
        </DialogTitle>
        <DialogContent>
          <FileUpload problemId={problemId} handleClose={handleClose} /> 
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

/*
This Page displays the problems of specified contest by contestId
*/

const EditProblems = () => {
  const contestId = parseInt(useParams()["id"] || "");
  // TODO: Handle NaN
  const [qs, setQs] = useState<any>([{ title: "Problems Goes Here", id: 0, ProblemIOs:[] }]);
  const [contestTitle, setContestTitle] = useState("Contest Title Goes Here");
  const [reload, setReload] = useState(true);
  const { user } = useAuth()!;

  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const { data } = await Axios.get(
        `/api/contest/admin/problems?contestId=${contestId}`
      );
      console.log(JSON.stringify(data.problems));
      setQs(data.problems);
      setContestTitle(data.title);
    })();
  }, [reload]);

  // console.log(user);
  return (
    <div>
      <Navbar />
      <Box display={"flex"}>
        <div style={{ width: "80%", margin: "auto" }}>
          <Typography fontSize={"2rem"} sx={{paddingBlock: '7px'}}>{contestTitle}</Typography>
          {qs.map(
            (
              { title, id: problemId,maxscore, ProblemIOs: pios  }: { title: string; id: number, maxscore:number, ProblemIOs:{id: number, input:string, output:string, score:number}[] },
              index: number
            ) => (
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
                  marginY: "10px",
                }}
                key={problemId}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div
                  style={{
                    display: "flex",
                    width: '100%',
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: 0,
                    padding: 10,
                  }}
                >
                  <div>
                    <Typography sx={{ paddingBottom: 1 }}>
                      {index + 1}. {title} {"\n"}
                    </Typography>
                    <Typography fontSize={11}>
                      <b>Max Score:</b> {maxscore}
                    </Typography>
                  </div>
                  <div style={{ display: "flex",alignItems:'center', marginLeft:'auto', marginRight:0 }}>
                    <div style={{marginInline:'10px', marginTop:'2px'}} onClick={()=>navigate(`/admin/problems/advance/${problemId}`)}>
                    <SettingsIcon />
                    </div>
                    {
                      <ProblemHelper
                        contestId={contestId}
                        initButton={
                          <Button size="small" color="info" variant="contained">
                            Edit
                          </Button>
                        }
                        reload={reload}
                        setReload={setReload}
                        problemId={problemId}
                      />
                    }
                    <Button
                      sx={{ marginInline: 1 }}
                      size="small"
                      color="error"
                      variant="contained"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const { data } = await Axios.delete(
                          `/api/problem/${problemId}`
                        );
                        alert(JSON.stringify(data));
                        setReload(!reload);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                </AccordionSummary>
                {/* <Divider/> */}
                <AccordionDetails>
                  <Typography>Test Cases:</Typography>
                  <List>
                    
                    {pios.map(({input, output, score}:{id:number, input:string, output:string, score:number}, index:number) => {
                      return <ListItem>
                        
                        <ListItemText primary={`Test Case: ${index}`} />
                        <ListItemButton onClick={()=>window.open(`/api/${input}`,'_blank', 'rel=noopener noreferrer')}><ListItemText primary='Input' /><ListItemIcon><LaunchIcon /> </ListItemIcon> </ListItemButton>
                        <ListItemButton onClick={()=>window.open(`/api/${output}`,'_blank', 'rel=noopener noreferrer')}><ListItemText primary='Output' /><ListItemIcon><LaunchIcon /> </ListItemIcon> </ListItemButton>
                      <ListItemText>Score: {score}</ListItemText>
                      <Button sx={{width:'40px', paddingLeft:0, color:"black"}}><DeleteIcon /></Button>
                      </ListItem>
                    })}
                  </List>
                  <CreateTextCases problemId={problemId} reload={reload} setReload={setReload } />
                </AccordionDetails>
              </Accordion>
            )
          )}

          {/* {user == "user1" || true ? ( */}
          <div style={{ marginLeft: "auto", marginRight: 0, width: 100 }}>
            <ProblemHelper
              contestId={contestId}
              initButton={
                <Button
                  sx={{ margin: "auto", width: 90 }}
                  color="success"
                  variant="contained"
                >
                  <Create />
                </Button>
              }
              reload={reload}
              setReload={setReload}
            />
          </div>
          {/* ) : (
            <>Hi</>
          )} */}
        </div>
      </Box>
    </div>
  );
};

export default EditProblems;
