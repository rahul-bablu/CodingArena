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
import LoadingScreen from "../common/LoadingScreen";

type UserData = {
  username: string;
  password: string;
};

type User = {
  id: string;
  role: string;
  username: string;
  // add rest if needed
};

type AuthContextType = {
  token: string;
  user: string | null;
  userObj: User | null;
  Axios: AxiosStatic;
  loginAction: (data: { userInfo: UserData; next?: string | null }) => Promise<void>;
  logOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userObj, setUserObj] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const alert = useContext(AlertContext);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        Axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        localStorage.setItem("token", token);
        try {
          const tdata = jwtDecode(token);
          let { sub, username, role } = tdata as any;

          // Send a request to the backend to validate the token and get user info
          const { data } = await Axios.get("/api/users/whoami");

          if (data && data.username === username) {
            setUser(username);
            setUserObj({ id: sub, username: username, role: role });
          } else {
            throw new Error("Token validation failed");
          }
        } catch (e) {
          alert?.showAlert("Error validating the token", "error");
          console.log(e);
          logOut();
        } finally {
          setLoading(false);
        }
      } else {
        delete Axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
        alert?.showAlert("Please relogin as the token is corrupted", "error");
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const loginAction = useMemo(
    () => async ({ userInfo: { username, password }, next }: { userInfo: UserData; next?: string | null }) => {
      try {
        const response = await Axios.post("api/users/authenticate", {
          username: username,
          password: password,
        });
        if (response.data && response.status === 200) {
          setUser(response.data.username);
          setToken(response.data.token);
          setUserObj(response.data);
          navigate(next == undefined || next == null ? "/" : next);
          return;
        }
        throw new Error(response.data);
      } catch (err:any) {
        console.error(err);
        alert?.showAlert("" + err.response.data.message, "error");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logOut = useMemo(
    () => () => {
      setUser(null);
      setToken("");
      setUserObj(null);
      navigate("/login");
    },
    []
  );

  if (loading) {
    return <LoadingScreen />
  }

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
