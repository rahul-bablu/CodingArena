import { useTheme } from "@mui/material";
import Axios from "axios";
import React, { useContext } from "react";
import { AlertContext } from "../common/AlertProvider";
import style from "./styles.module.css";

function SignUpForm() {
  const [state, setState] = React.useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const theam = useTheme();
  const handleChange = (evt: any) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };
  const alert = useContext(AlertContext);
  const handleOnSubmit = async (evt: any) => {
    evt.preventDefault();
    if(state.cpassword != state.password) {
      return alert?.showAlert("Password didn't match with conform password", 'error')
    }
    // const { name, } = state;
    // alert(
    //   `We can hear you ${name} but we are not taking registrations right now`
    // );
    try{
    const response = await Axios.post("api/users/register", {
      username: state.name,
      password: state.password,
      email: state.email,
    });
    if(response.status == 200) {
      alert?.showAlert(response.data.message, 'success');
      window.location.reload();
    } 
    console.log(response)
  }catch(e : any) {
    console.log(e)
      alert?.showAlert(e.response.data.message, 'error')
    }

    for (const key in state) {
      setState({
        ...state,
        [key]: "",
      });
    }
  };

  return (
    <div className={style["form-container"] + " " + style["sign-up-container"]} style={{background: theam.palette.background.default, color:theam.palette.text.primary}}>
      <form className={style["form"]} onSubmit={handleOnSubmit}>
        <h1 className={style.h1} style={{ paddingBlock: 20 }}>Create Account</h1>
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
        <span>or use your email for registration</span> */}
        <input
        className={style["input"]}
        style={{background: theam.palette.secondary.main, color: theam.palette.text.primary}}
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
        className={style["input"]}
        style={{background: theam.palette.secondary.main, color: theam.palette.text.primary}}
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
        className={style["input"]}
        style={{background: theam.palette.secondary.main, color: theam.palette.text.primary}}
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
          required

        />
        <input
        className={style["input"]}
        style={{background: theam.palette.secondary.main, color: theam.palette.text.primary}}
          type="password"
          name="cpassword"
          value={state.cpassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required

        />
        <button className={style["button"]}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
