import { createTheme, CssBaseline, Switch, ThemeProvider } from "@mui/material";
import React, { Suspense, useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import "./App.css";
import AuthProvider from "./components/Auth/AuthProvider";
import PrivateRoute from "./components/Auth/PrivateRouter";
import Leaderbord from "./components/Code/Leaderboard";
import AlertProvider from "./components/common/AlertProvider";
import AdvanceEditProblem from "./views/AdvanceEditProblem";
import Contests from "./views/Contests/Contests";
import EditProblems from "./views/EditProblems";
import FullScreenComponent, { ContestLandingPage } from "./views/Test";
import { UserSubs } from "./views/UserSubs";
const ProblemsPage = React.lazy(() => import("./views/Problems"));
const HomePage = React.lazy(() => import("./views/Home"));
const CodePage = React.lazy(() => import("./views/Code"));
const LoginPage = React.lazy(() => import("./components/Login/Login"));
const EditContestsPage = React.lazy(() => import("./views/EditContests"));
const EditUsersPage = React.lazy(() => import("./views/EditUsers"));

import { styled } from "@mui/system";
import Axios from "axios";
import { AnimatePresence } from "framer-motion";
import AdminHome from "./components/AdminViews/AdminHome";
import ViewSubmissions from "./components/AdminViews/ViewSubmissions";
import AdminRoute from "./components/Auth/AdminRouts";
import LoadingScreen from "./components/common/LoadingScreen";
import NotFound from "./components/common/NotFound";
import AdminCodeRunner from "./views/AdminCodeRunner";
import ClubHome from "./views/MainHome/ClubHome";
import Room from "./views/Rooms/Room";
import RoomContests from "./views/Rooms/RoomContests";
import RoomLeaderboard from "./views/Rooms/RoomLeaderboard";
const router = createBrowserRouter([
  {
    path: "/tt",
    element: <ClubHome />,
  },
  {
    path: "/",
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        path: "/lab",
        element: <AdminCodeRunner />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/code/:id",
            element: <CodePage />,
          },
          {
            path: "/contests",
            element: <Contests />,
          },
          {
            path: "/rooms",
            element: <Room />,
          },
          {
            path: "/rooms/:roomName",
            element: <RoomContests />,
          },
          {
            path: "/problems/:id",
            element: (
              <FullScreenComponent>
                <ProblemsPage />
              </FullScreenComponent>
            ),
          },
          {
            path: "/user/details",
            element: <UserSubs />,
          },
          {
            path: "/leaderboard/:id",
            element: <Leaderbord />,
          },
          {
            path: "rooms/leaderboard/:id",
            element: <RoomLeaderboard />,
          },
          {
            path: "/test/:id",
            element: <ContestLandingPage />,
          },
          {
            path: "/test/problems/:id",
            element: (
              <FullScreenComponent>
                <ProblemsPage />
              </FullScreenComponent>
            ),
          },
          {
            path: "/test/problem/:id",
            element: (
              <FullScreenComponent>
                <CodePage />
              </FullScreenComponent>
            ),
          },
          {
            path: "/test/leaderboard/:id",
            element: (
              <FullScreenComponent>
                <Leaderbord />
              </FullScreenComponent>
            ),
          },
          {
            element: <AdminRoute />,
            children: [
              {
                path: "/admin/home",
                element: <AdminHome />,
              },
              {
                path: "/admin/viewsubmissions",
                element: <ViewSubmissions />,
              },
              {
                path: "/admin/contests",
                element: <EditContestsPage />,
              },
              {
                path: "/admin/users",
                element: <EditUsersPage />,
              },
              {
                path: "/admin/problems/:id",
                element: <EditProblems />,
              },
              {
                path: "/admin/problems/advance/:id",
                element: <AdvanceEditProblem />,
              },
            ],
          },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
const lightTheme = createTheme({
  palette: {
    mode: "light",

    secondary: {
      main: "#f3f3f3", // Grey color
    },
    background: {
      default: "#f5f5f5", // Light grey background
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: "#fff", // Text color for primary buttons
          backgroundColor: "#4a90e2", // Background color for primary buttons
          "&:hover": {
            backgroundColor: "#7a70f2", // Background color on hover for primary buttons
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff", // White AppBar
          boxShadow: "none", // Remove the default box shadow
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          fontSize: "1.25rem",
          fontWeight: "bold",
          color: "#000000", // Black text for contrast
        },
      },
    },
  },
});

// Define the dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",

    secondary: {
      main: "#424242", // Grey color
    },
    background: {
      default: "#252525", // Dark grey background
    },
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#333333",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#000000", // Black AppBar
          boxShadow: "none", // Remove the default box shadow
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          fontSize: "1.25rem",
          fontWeight: "bold",
          color: "#ffffff", // White text for contrast
        },
      },
    },
  },
});

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    Axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    const savedMode = localStorage.getItem("themeMode") as any | null;
    setMode(savedMode);
    if (savedMode) {
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setMode(systemPrefersDark ? "dark" : "light");
    }
  }, []);
  const toggleColorMode = (newMode: "dark" | "light") => {
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingScreen />}>
        <ThemeProvider theme={mode == "dark" ? darkTheme : lightTheme}>
          <CssBaseline />
          <MaterialUISwitch
            sx={{
              m: 1,
              position: "fixed",
              bottom: "0",
              left: "10",
              zIndex: 10,
            }}
            checked={mode == "dark"}
            onChange={(e: any) =>
              toggleColorMode(e.target.checked ? "dark" : "light")
            }
          />
          <AlertProvider>
            <RouterProvider router={router} />
          </AlertProvider>
        </ThemeProvider>
      </Suspense>
    </AnimatePresence>
  );
}

export default App;
