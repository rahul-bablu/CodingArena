import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  createTheme,
  CssBaseline,
  IconButton,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { Suspense, useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import "./App.css";
import AuthProvider from "./components/Auth/AuthProvider";
import PrivateRoute from "./components/Auth/PrivateRouter";
import Leaderbord from "./components/Code/Leaderboard";
import AlertProvider from "./components/common/AlertProvider";
import AdvanceEditProblem from "./views/AdvanceEditProblem";
import Contests from "./views/Contests";
import EditProblems from "./views/EditProblems";
import Tmp from "./views/LabCom";
import FullScreenComponent, { ContestLandingPage } from "./views/Test";
import { UserSubs } from "./views/UserSubs";
const ProblemsPage = React.lazy(() => import("./views/Problems"));
const HomePage = React.lazy(() => import("./views/Home"));
const CodePage = React.lazy(() => import("./views/Code"));
const LoginPage = React.lazy(() => import("./components/Login/Login"));
const EditContestsPage = React.lazy(() => import("./views/EditContests"));

import { styled } from "@mui/system";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/lab",
        element: <Tmp />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "/code/:id",
            element: <CodePage />,
          },
          {
            path: "/contests",
            element: <Contests />,
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
            path: "/admin/contests",
            element: <EditContestsPage />,
          },
          {
            path: "/admin/problems/:id",
            element: <EditProblems />,
          },
          {
            path: "/admin/problems/advance/:id",
            element: <AdvanceEditProblem />,
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
        ],
      },
    ],
  },
]);
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ffffff", // White color for AppBar
    },
    secondary: {
      main: "#f3f3f3", // Grey color
    },
    background: {
      default: "#f5f5f5", // Light grey background
    },
    text: {
      primary: "#000000", // Black text for contrast on white AppBar
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: '#fff', // Text color for primary buttons
          backgroundColor: '#1976d2', // Background color for primary buttons
          '&:hover': {
            backgroundColor: '#1565c0', // Background color on hover for primary buttons
          },
        },
        outlinedPrimary: {
          color: '#1976d2',
          border: '1px solid #1976d2',
          '&:hover': {
            backgroundColor: '#ccc', // Background color on hover for primary buttons
            color: '#1565c0',
            border: '1px solid #1976d2',
          },
        }
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
    primary: {
      main: "#111111", // Black color for AppBar
      
    },
    secondary: {
      main: "#424242", // Grey color
    },
    background: {
      default: "#252525", // Dark grey background
    },
    text: {
      primary: "#ffffff", // White text for contrast on black AppBar
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

// Define styled component for NavButtons with underline effect on hover
const NavButton = styled(Button)(({ theme }) => ({
  textTransform: "none", // Remove uppercase transformation
  color: theme.palette.text.primary, // Use the primary text color
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    width: "0",
    height: "2px",
    display: "block",
    marginTop: "15px",
    right: "0",
    background: theme.palette.text.primary,
    transition: "width 0.3s ease",
  },
  "&:hover::after": {
    width: "100%",
    left: "0",
    backgroundColor: theme.palette.text.primary,
  },
}));

// Define the custom navigation bar component
const NavBar = () => (
  <AppBar position="static">
    <Toolbar sx={{ minHeight: 0, maxHeight: "80px" }}>
      <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        My App
      </Typography>
      <NavButton>Home</NavButton>
      <NavButton>About</NavButton>
      <NavButton>Contact</NavButton>
    </Toolbar>
  </AppBar>
);

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <Suspense
      fallback={
        <Box sx={{ width: "100%", height: "100vh", position: "relative" }}>
          <div
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              position: "absolute",
            }}
          >
            <CircularProgress />
          </div>
        </Box>
      }
    >
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <MaterialUISwitch sx={{ m: 1, position: 'fixed', bottom: '0', left: '10', zIndex: 10 }} defaultChecked={isDarkMode} onChange={(e: any) => setIsDarkMode(e.target.checked)} />
        <AlertProvider>
        
          <RouterProvider router={router} />
        </AlertProvider>
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
