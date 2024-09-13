import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import Navbar from "../components/common/Navbar";

import { Create } from "@mui/icons-material";
import { TransitionProps } from "@mui/material/transitions";
import Axios from "axios";
import dayjs from "dayjs";
import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/Auth/AuthProvider";

const ContestHelper = ({ handleClose }: { handleClose: () => void }) => {
  type State = "manual" | "inactive" | "active" | "end" | "manualactive";
  const [state, setState] = useState<State>("inactive");
  const [title, setTitle] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { data } = await Axios.post("/api/contest/create", {
      title,
      state,
      startTime,
      endTime,
    });
    console.log(data);
    handleClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ margin: "auto", width: "max-content" }}
    >
      {/* <div > */}
      {/* </div> */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
          <TextField
            onChange={(e) => setTitle(e.target.value)}
            label="Title"
            fullWidth
            inputProps={{ maxLength: 128 }}
            helperText={`${title?title.length:0}/128`}
          ></TextField>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="State-selection-lable">State</InputLabel>
            <Select
              labelId="State-selection-lable"
              id="State-selection-lable"
              value={state}
              label="State"
              onChange={(e) => setState(e.target.value as State)}
              // size="small"
              size="medium"
            >
              <MenuItem value={"manual"}>manual</MenuItem>
              <MenuItem value={"manualactive"}>manualactive</MenuItem>
              <MenuItem value={"inactive"}>inactive</MenuItem>
              <MenuItem value={"active"}>active</MenuItem>
              <MenuItem value={"end"}>end</MenuItem>
            </Select>
          </FormControl>
          <DateTimePicker
            label="Start Time"
            value={startTime}
            onChange={(newValue) => {
              if (newValue != null) return setStartTime(newValue);
            }}
          />
          <DateTimePicker
            label="End Time"
            value={endTime}
            onChange={(newValue) => {
              if (newValue != null) return setEndTime(newValue);
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
      <div
        style={{
          marginInline: "auto",
          marginBlock: "5px",
          width: "max-content",
        }}
      >
        <Button type="submit" variant="contained">
          Create
        </Button>
      </div>
    </form>
  );
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CreateContest({
  reload,
  setReload,
}: {
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [open, setOpen] = useState(false);
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
        sx={{ margin: "auto", width: 90 }}
        onClick={handleClickOpen}
        color="success"
        variant="contained"
      >
        <Create />
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Create Contest"}
        </DialogTitle>
        <DialogContent>
          <ContestHelper handleClose={handleClose} />
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

const EditContests = () => {
  const [qs, setQs] = useState<any>([
    { title: "This should not appier", id: 0 },
  ]);
  const { user } = useAuth()!;
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const { data } = await Axios.get(`/api/contest`, {
        withCredentials: true,
      });
      // const { data } = await Axios.post(`/api/contest/adduser/1`,{userId:1}, {withCredentials:true});
      console.log(data);
      setQs(data);
    })();
  }, [reload]);

  // async function handleRegister() {
  //   const { data } = await Axios.post(`/api/contest/adduser/1`,{userId:1}, {withCredentials:true});
  //   console.log(data);
  // }
  // console.log(user);
  return (
    <div>
      <Navbar />
      <div style={{width:'max-content', marginInline:'auto', marginTop:'20px'}}><Typography  sx={{fontWeight:500, fontSize: '25px'}} gutterBottom >Edit Contest</Typography></div>
      <Box
        display={"flex"}
        // alignItems="center"/
      >
        <div style={{ width: "100%" }}>
          {
            qs.map(
              ({ title, id }: { title: string; id: number }, index: number) => (
                <Card
                  variant="outlined"
                  sx={{
                    fontFamily: "sans-serif",
                    margin: "auto",
                    width: "80%",
                    marginY: "10px",
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
                    <div onClick={() => navigate(`/admin/problems/${id}`)}>
                      <Typography sx={{ paddingBottom: 1 }}>
                        {index + 1}. {title} {"\n"}
                      </Typography>
                      {/* <Typography fontSize={11}>
                        This is a short desc if needed
                      </Typography> */}
                    </div>
                    {/* <div>
                      {registred? <Button size="small" variant="outlined" disabled>Registered..</Button>:<Button size="small" variant="contained" color="success" onClick={handleRegister}>Register</Button>}
                    </div> */}
                    <div>
                      <Button
                        size="small"
                        color="info"
                        onClick={() => navigate(`/admin/problems/${id}`)}
                        variant="contained"
                      >
                        Edit
                      </Button>
                      <Button
                        sx={{ marginInline: 1 }}
                        size="small"
                        color="error"
                        variant="contained"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            )
          }
        </div>
      </Box>

      <div style={{ margin: "auto", width: "80%" }}>
        {user == "user1" || true ? (
          <div style={{ marginLeft: "auto", marginRight: 0, width: 100 }}>
            <CreateContest reload={reload} setReload={setReload} />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default EditContests;
