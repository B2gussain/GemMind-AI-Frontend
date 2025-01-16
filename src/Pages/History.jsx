import React, {  useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import {assets}  from "../assets/assets.js";
import { RxCross2 } from "react-icons/rx";
const History = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/home" />;
  }
  const [prompts, setPrompts] = useState([]);
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/gemini/prompts`, {
          method: "GET",
          headers: {
            Authorization: token, // Send token directly as it already includes 'Bearer'
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch prompts");
        }

        const data = await response.json();
        if (data && data.prompts) {
          setPrompts([...data.prompts].reverse());
        }
      } catch (error) {
        console.error("Error fetching prompts:", error);
      }
    };

    if (token) {
      fetchPrompts();
    }
  }, [token]);

  const deletePrompt = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prompt?")) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/gemini/prompts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token, // Send token directly as it already includes 'Bearer'
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete prompt");
      }

      // Remove the deleted prompt from the state
      setPrompts((prevPrompts) => prevPrompts.filter((prompt) => prompt._id !== id));
    } catch (error) {
      console.error("Error deleting prompt:", error);
    }
    // fetchPrompts();
  };

  return (
    <div className="home history_page">
      <Sidebar />
      <nav></nav>
      <h1>History</h1>
      <div className="lists">
        {prompts && prompts.length > 0 ? (
          <>
            {prompts.map((item, index) => (
              <div
                key={index}
                className="history-list"
              >
                <img className="messageimg" src={assets.message} alt="" />
                <p>{item.prompt.slice(0, 30)}...</p>
                <RxCross2 className="cross_history"    onClick={() => deletePrompt(item._id)}/>
              </div>
            ))}
          </>
        ) : (
          <p className="no-prompts">No History</p>
        )}
      </div>
    </div>
  );
};

export default History;
