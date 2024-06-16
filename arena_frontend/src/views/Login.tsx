import { ChangeEvent, FormEvent, useState } from "react";
import { useAuth } from "../components/Auth/AuthProvider";

const Login = () => {
  const { loginAction } = useAuth()!;
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const handleSubmitEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (input.username !== "" && input.password !== "") {
      alert(input.username + input.password);
      await loginAction({ username: input.username, password: input.password });
    } else alert("please provide a valid input");
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmitEvent}>
      <div className="form_control">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="usernmae"
          name="username"
          aria-describedby="user-email"
          aria-invalid="false"
          onChange={handleInput}
        />
        <div id="user-email" className="sr-only">
          Please enter a valid username. It must contain at least 6 characters.
        </div>
      </div>
      <div className="form_control">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          aria-describedby="user-password"
          aria-invalid="false"
          onChange={handleInput}
        />
        <div id="user-password" className="sr-only">
          your password should be more than 6 character
        </div>
      </div>
      <button className="btn-submit">Submit</button>
    </form>
  );
};

export default Login;
