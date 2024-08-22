import Axios, { AxiosStatic } from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../common/AlertProvider";

type UserData = {
  username: string;
  password: string;
};

type User = {
  id:string, 
  role: string,
  // add rest
}

type AuthContextType = {
  token: string;
  user: string | null;
  userObj: User | null; 
  Axios: AxiosStatic;
  loginAction: (data: UserData) => Promise<void>;
  logOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userObj, setUserObj] = useState<User | null>(null);
  const navigate = useNavigate();
  const alert = useContext(AlertContext);
  useEffect(() => {
    if (token) {
      Axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem("token", token);
      Axios.get("/api/users/whoami").then(({data})=>{
        setUser(data.username);
      }).catch((e)=>{
        console.log(e)
      })
    } else {
      delete Axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  const loginAction = useMemo(
    () =>
      async ({ username, password }: UserData) => {
        try {
          const response = await Axios.post("api/users/authenticate", {
            username: username,
            password: password,
          });
          if (response.data && response.status == 200) {
            console.log(response.data);
            setUser(response.data.username);
            setToken(response.data.token);
            setUserObj(response.data);
            navigate("/");
            return;
          }
          throw new Error(response.data);
        } catch (err) {
          console.error(err);
          alert?.showAlert("" + err, "error");
        }
      },
    []
  );

  const logOut = useMemo(
    () => () => {
      setUser(null);
      setToken("");
      navigate("/login");
    },
    []
  );

  return (
    <AuthContext.Provider value={{ token, user, userObj, Axios, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
