import { Box, CircularProgress } from "@mui/material";
import React, { Suspense } from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

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

const ProblemsPage = React.lazy(() => import("./views/Problems"));
const HomePage = React.lazy(() => import("./views/Home"));
const CodePage = React.lazy(() => import("./views/Code"));
const LoginPage = React.lazy(() => import("./components/Login/Login"));
const EditContestsPage = React.lazy(() => import("./views/EditContests"));


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
                {" "}
                <CodePage />{" "}
              </FullScreenComponent>
            ),
          },
        ],
      },
    ],
  },
]);

function App() {
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
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
    </Suspense>
  );
}

export default App;
