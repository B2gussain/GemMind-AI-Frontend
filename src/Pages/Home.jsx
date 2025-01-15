import React from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import Main from "../components/Main/Main.jsx";

const Home = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="home">
      <Sidebar />
      <Main />
    </div>
  );
};

export default Home;
