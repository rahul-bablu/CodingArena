import { useState } from "react";
import Navbar from "../common/Navbar";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";
import style from "./styles.module.css";

export default function Login() {
  const [type, setType] = useState("signIn");
  const handleOnClick = (text:any) => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  return (
    <>
    
    <Navbar/>
    <div className={style.App}>
      <div className={style["container"] + " " + style[(type === "signUp" ? "right-panel-active" : "")]} id="container">
        <SignUpForm />
        <SignInForm />
        <div className={style["overlay-container"]}>
          <div className={style["overlay"]}>
            <div className={style["overlay-panel"] + " " + style["overlay-left"]}>
              <h1 className={style.h1}>Welcome Back!</h1>
              <p className={style.p}>
                To keep connected with us please login with your personal info
              </p>
              <button
                className={"ghost " + style.button}
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className={style["overlay-panel"]+  " " + style["overlay-right"]}>
              <h1 className={style["h1"]}>Hello, Coder!</h1>
              <p className={style.p}>Enter your personal details and start journey with us</p>
              <button
                className={"ghost " + style.button}
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
