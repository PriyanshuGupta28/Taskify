import { createTheme, CssBaseline, Stack, ThemeProvider } from "@mui/material";
import AllRoutes from "./components/AllRoutes/AllRoutes";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  return (
    <Stack sx={{ width: "100%" }}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Navbar />
        <AllRoutes />
      </ThemeProvider>
    </Stack>
  );
}

export default App;
