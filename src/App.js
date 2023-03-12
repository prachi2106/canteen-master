import { Outlet } from "react-router";
import Header from "./Component/AppBar/Header";
import Home from "./Component/Common/Home";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey, red } from '@mui/material/colors';

export const config = {
  endpoint: `https://63e5bc6f7eef5b2233785df2.mockapi.io/api/v1`,
};

const theme = createTheme({
  palette: {
    primary: {
      main : grey[400]
    },
    secondary : {
      main : red.A100
    },
    primaryFont : {
      main : red[900]
    },
  },
});

function App() {
  return (
    <>
    <ThemeProvider theme={theme}>
      <Header />
      <Outlet />
      </ThemeProvider>
    </>
  );
}

export default App;
