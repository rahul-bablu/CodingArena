import React, { useContext } from "react";
import { useAuth } from "../Auth/AuthProvider";
import { AlertContext } from "../common/AlertProvider";
import style from "./styles.module.css";
function SignInForm() {
  const { loginAction } = useAuth()!;
  const alert = useContext(AlertContext);
  const [state, setState] = React.useState({
    username: "",
    password: "",
  });
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
      
        await loginAction(state);
      
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

  return (
    <div className={style["form-container"] + " " + style["sign-in-container"]}>
      <form className={style["form"]} onSubmit={handleOnSubmit}>
        <h1 className={style.h1} style={{ padding: 20 }}>Sign in</h1>
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
          type="text"
          name="username"
          placeholder="Username"
          value={state.username}
          onChange={handleChange}
        />
        <input
        className={style["input"]}
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        <a className={style.a} href="#">Forgot your password?</a>
        <button className={style.button}>Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
