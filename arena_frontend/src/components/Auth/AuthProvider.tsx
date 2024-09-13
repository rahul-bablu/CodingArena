import Axios, { AxiosStatic } from "axios";
import { jwtDecode } from "jwt-decode";
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
  username:string
  // add rest
}

type AuthContextType = {
  token: string;
  user: string | null;
  userObj: User | null; 
  Axios: AxiosStatic;
  loginAction: (data: {userInfo:UserData, next?: string|null}) => Promise<void>;
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
      const tdata = jwtDecode(token)
      try {
        let {sub, username, role} = tdata as any;
        setUser(username);
        setUserObj({id: sub, username:username, role:role})
      } catch(e){
        alert?.showAlert('Error validating the token', 'error')
        console.log(e);
      }
      // Axios.get("/api/users/whoami").then(({data})=>{
      //   setUser(data.username);
      //   setUserObj(data);
      // }).catch((e)=>{
      //   console.log(e)
      // })
    } else {
      delete Axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  const loginAction = useMemo(
    () =>
      async ({userInfo:{ username, password }, next}: {userInfo:UserData,next?:string | null } ) => {
        try {
          const response = await Axios.post("api/users/authenticate", {
            username: username,
            password: password,
          });
          if (response.data && response.status == 200) {
            setUser(response.data.username);
            setToken(response.data.token);
            setUserObj(response.data);
            navigate(next == undefined || next == null?'/':next);
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
