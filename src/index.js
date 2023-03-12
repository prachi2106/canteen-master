import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { Routes, Route } from "react-router-dom";
import Login from "./Component/Common/Login";
import EmployeeTable from "./Component/Admin/EmployeePortal";
import ItemPortal from "./Component/Admin/ItemPortal";
import Transaction from "./Component/Common/Transaction";
import Menu from "./Component/Employee/Menu";
import Home from "./Component/Common/Home";
import Signup from "./Component/Employee/Signup";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <SnackbarProvider
      maxSnack={1}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="employee-portal" element={<EmployeeTable />} />
          <Route path="item-portal" element={<ItemPortal />} />
          <Route path="transactions" element={<Transaction />} />
          <Route path="menu" element={<Menu />} />
          <Route path="home" element={<Home />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />}/>
      </Routes>
    </SnackbarProvider>
  </BrowserRouter>
);
