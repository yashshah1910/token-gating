import React from "react";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",

    // palette values for dark mode
    primary: {
      50: "#F0F7FF",
      100: "#C2E0FF",
      200: "#99CCF3",
      300: "#66B2FF",
      400: "#3399FF",
      500: "#007FFF",
      600: "#0072E5",
      700: "#0059B2",
      800: "#004C99",
      900: "#003A75",
      contrastText: "rgba(0, 0, 0, 0.87)",
      dark: "#0059B2",
      light: "#66B2FF",
      main: "#3399FF",
    },
    divider: "rgba(194, 224, 255, 0.08)",
    background: {
      default: "#001E3C",
      paper: "#0A1929",
    },
    text: {
      primary: "#fff",
      secondary: "#B2BAC2",
    },
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Navbar />
        <Home />
        <Footer />
      </ThemeProvider>
    </>
  );
}

export default App;
