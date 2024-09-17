import { Box, CircularProgress } from "@mui/material";

const LoadingScreen = () => {
    return (
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
    )
}

export default LoadingScreen;