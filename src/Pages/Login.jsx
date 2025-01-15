import React, { useState, useRef } from 'react';
import { FaRobot, FaRegEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import dotenv from "dotenv"


const Login = () => {
  const [form_change, setform_change] = useState(true);
  const [eye_change, seteye_change] = useState(true); // State to track password visibility
  const password_type = useRef(null); // Ref for password input field
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const navigate = useNavigate(); // Initialize navigate function

  // Toggle between Login and Register forms
  const form_type_toggle = () => {
    setform_change(!form_change);
  };

  // Toggle password visibility
  const eye_toggle = () => {
    seteye_change(prevState => !prevState);
    if (password_type.current) {
      password_type.current.type = eye_change ? 'text' : 'password'; // Change input type
    }
  };

  const API_BASE_URL = `${import.meta.env.VITE_API_BACKEND}/auth`;

  // Handle Sign In
  const handle_signin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/signin`, {
        email,
        password,
      });
      const { token, name } = response.data;
      localStorage.setItem("token", token); // Store JWT token
      localStorage.setItem("username", name); // Store username
      alert("Sign-in successful!");
      navigate("/home"); // Navigate to Home page
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message;
        alert(`Error: ${errorMessage}`);
      } else {
        console.error("Sign-in error:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Handle Sign Up
  const handle_signup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/signup`, {
        name,
        email,
        password,
      });
      alert("Sign-up successful! You can now log in.");
      form_type_toggle(); // Switch to sign-in form
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        console.error("Sign-up error:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login">
      <div className="login-form-box">
        <h1><span><FaRobot /></span>GemMind</h1>
        <p>Experience AI-powered conversations.</p>
        {form_change ? (
          <form onSubmit={handle_signin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="input"
              placeholder="Enter Email"
            />
            <div className="password-block">
              <input
                ref={password_type}
                type="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                className="password-input"
                placeholder="Enter Password"
              />
              {eye_change ? (
                <FaRegEye className="eye" onClick={eye_toggle} />
              ) : (
                <FaEyeSlash className="eye" onClick={eye_toggle} />
              )}
            </div>
            <button>Sign in</button>
            <p className="form-change-p">
              Don't have an account?
              <span className="form-change-button" onClick={form_type_toggle}> REGISTER</span>
            </p>
          </form>
        ) : (
          <form onSubmit={handle_signup}>
            <input
              type="text"
              value={name}
              onChange={(e) => setname(e.target.value)}
              className="input"
              placeholder="Enter Name"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="input"
              placeholder="Enter Email"
            />
            <div className="password-block">
              <input
                ref={password_type}
                type="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                className="password-input"
                placeholder="Enter Password"
              />
              {eye_change ? (
                <FaRegEye className="eye" onClick={eye_toggle} />
              ) : (
                <FaEyeSlash className="eye" onClick={eye_toggle} />
              )}
            </div>
            <button>Sign up</button>
            <p className="form-change-p">
              Already have an account?
              <span className="form-change-button" onClick={form_type_toggle}> LOG IN</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
