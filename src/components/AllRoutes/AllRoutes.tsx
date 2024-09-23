import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../../pages/Login/Login";
import Signup from "../../pages/Signup/Signup";
import { AuthContext } from "../../contexts/AuthContext";
import Home from "../../pages/Home/Home";
import { CircularProgress, Box } from "@mui/material";

const AllRoutes: React.FC = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/todos" replace />}
      />
      <Route
        path="/signup"
        element={!user ? <Signup /> : <Navigate to="/todos" replace />}
      />
      <Route
        path="/todos"
        element={user ? <Home /> : <Navigate to="/login" replace />}
      />
      <Route
        path="*"
        element={<Navigate to={user ? "/todos" : "/login"} replace />}
      />
    </Routes>
  );
};

export default AllRoutes;
