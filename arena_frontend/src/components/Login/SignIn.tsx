import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  useTheme,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
import { AlertContext } from "../common/AlertProvider";
import style from "./styles.module.css";
function SignInForm() {
  const { loginAction } = useAuth()!;
  const alert = useContext(AlertContext);
  const [open, setOpen] = useState(false);
  const [uore, setUorE] = useState("");
  const [state, setState] = React.useState({
    username: "",
    password: "",
  });
  const theam = useTheme();
  const [searchParams, ] = useSearchParams();
  const handleChange = (evt: any) => {
    const value = evt.target.value;
    setState((pstate) => ({
      ...pstate,
      [evt.target.name]: value,
    }));
  };

  const handleOnSubmit = async (evt: any) => {
    evt.preventDefault();

    // alert(`You are login with email: ${username} and password: ${password}`);
    if (state.username !== "" && state.password !== "") {
      await loginAction({ userInfo: state, next: searchParams.get("next") });
    } else {
      alert?.showAlert("Please enter all the fields to proceed", "warning");
    }
    for (const key in state) {
      setState({
        ...state,
        [key]: "",
      });
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={style["form-container"] + " " + style["sign-in-container"]} style={{background: theam.palette.background.default, color:theam.palette.text.primary}}>
      <form className={style["form"]} onSubmit={handleOnSubmit}>
        <h1 className={style.h1} style={{ padding: 20,  }}>
          Sign in
        </h1>
        {/* <div className="social-container">
          <a href="#" className="social">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-google-plus-g" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-linkedin-in" />
          </a>
        </div>
        <span>or use your account</span> */}
        {/* <input
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
        /> */}
        <input
          className={style["input"]}
          style={{background: theam.palette.secondary.main}}
          type="text"
          name="username"
          placeholder="Username"
          value={state.username}
          onChange={handleChange}
        />
        <input
          className={style["input"]}
          style={{background: theam.palette.secondary.main}}
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        <div className={style.a} style={{color: theam.palette.primary.main}} onClick={() => setOpen(true)}>
          Forgot your password?
        </div>
        <button className={style.button}>Sign In</button>
        <Dialog
          open={open}
          // TransitionComponent={Transition}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Forgot Password"}
          </DialogTitle>
          <DialogContent sx={{ minWidth: "400px" }}>
            <TextField
              label="Username/Email"
              defaultValue={uore}
              onChange={(e) => setUorE(e.target.value)}
              sx={{ marginBlock: "10px" }}
              fullWidth
            ></TextField>
            <div style={{ width: "max-content", margin: "auto" }}>
              <Button
                variant="contained"
                onClick={() => {
                  if (uore == "")
                    return alert?.showAlert(
                      "Plese enter username or password",
                      "warning"
                    );
                  alert?.showAlert(`You entered ${uore}`, "success");
                }}
              >
                Send new password
              </Button>
            </div>
          </DialogContent>
          {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="success" variant="contained">
            <Add/>
          </Button>
        </DialogActions> */}
        </Dialog>
      </form>
    </div>
  );
}

export default SignInForm;
