import React, { useContext, useEffect, useState } from "react";
import { FaRobot, FaMicrophone, FaArrowUp, FaRegCopy } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Navigate } from "react-router-dom";
import "./Main.css";
import { assets } from "../../assets/assets";
// import Sidebar from "../Sidebar/Sidebar";
import { Context } from "../../context/Context";
import axios from "axios";

const Main = () => {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("username");
  if (!token) {
    return <Navigate to="/" />;
  }

  const {
    onSent,
    recentprompt,
    showresult,
    loading,
    resultdata,
    setinput,
    input,
  } = useContext(Context);

  const [isListening, setIsListening] = useState(false);
  const [dp_form, setdp_form] = useState(false);
  const [image, setImage] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in your browser. Try Chrome.");
      return;
    }

    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setinput((prev) => prev + " " + transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && input.trim()) {
      await handlePromptSubmission();
      e.preventDefault();
    }
  };

  const handleProfile = async () => {
    try {
      if (!image) {
        alert("No image selected.");
        return;
      }

      if (!token) {
        alert("User is not authenticated.");
        return;
      }

      console.log("Token before request:", token); // Debugging log

      const formData = new FormData();
      formData.append("profilePicture", image);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND}/profile/profile-picture`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Profile picture updated successfully:", response.data);
      alert("Profile picture updated successfully.");
      fetchProfilePicture()
    } catch (err) {
      console.error("Error submitting profile-pic:", err.response?.data || err.message || err);
      if (err.response?.status === 401) {
        alert("Invalid token. Please log in again.");
        // Optional: Redirect to login
      } else {
        alert("Failed to submit profile-pic. Please try again.");
      }
    }
  };

  const handleProfileDelete = async () => {
    try {
      if (!token) {
        alert("User is not authenticated.");
        return;
      }

      const response = await axios.delete(`${import.meta.env.VITE_API_BACKEND}/profile/profile-picture`, {
        headers: {
          Authorization: token,
        },
      });

      console.log("Profile picture deleted successfully:", response.data);
      alert("Profile picture deleted successfully.");
      setProfilePicture(null); // Clear the profile picture preview in the UI
    } catch (err) {
      console.error("Error deleting profile picture:", err.response?.data || err.message || err);
      alert("Failed to delete profile picture. Please try again.");
    }
  };
  const fetchProfilePicture = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BACKEND}/profile/profile-picture`, {
        headers: {
          Authorization: token,
        },
        responseType: "blob", // To handle image data
      });

      // Check if the response is a valid image blob
      if (response.headers['content-type'].startsWith('image/')) {
        const imageUrl = URL.createObjectURL(response.data);
        setProfilePicture(imageUrl);
      } else {
        console.error("Received non-image data:", response.data);
        alert("Failed to fetch profile picture.");
      }
    } catch (err) {
      console.error("Error fetching profile picture:", err.response?.data || err.message || err);
    }
  };
  useEffect(() => {
    if (token) {
      fetchProfilePicture();
    }
  }, [token]);

  const handlePromptSubmission = async () => {
    if (!input.trim()) {
      alert("Prompt cannot be empty.");
      return;
    }
    onSent();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND}/gemini`,
        { prompt: input },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("Prompt saved:", response.data);

      setinput("");
    } catch (err) {
      console.error("Error submitting prompt:", err.message || err);
      alert("Failed to submit prompt. Please try again.");
    }
  };

  const copyToClipboard = () => {
    const textToCopy = document.querySelector(".output p").innerText;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Text copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy text. Please try again.");
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }
      setImage(file);
    }
  };

  return (<>
    {/* <div className="main"> */}
      {dp_form && (
        <div className="dp_upload">
          <RxCross2 className="cross" onClick={() => setdp_form((prev) => !prev)} />
          <label htmlFor="inputTag" className="dp_label">
            {image ? (
              <img src={URL.createObjectURL(image)} alt="Preview" className="image_preview" />
            ) : (
              <img src={assets.dp} alt="Default" />
            )}
            <input
              id="inputTag"
              type="file"
              accept="image/*"
              className="dp_input"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </label>
          <div className="buttons">
            <button onClick={() => document.getElementById("inputTag").click()}>
              Select
            </button>
            <button onClick={handleProfile}>Save</button>
            <button onClick={handleProfileDelete}>Delete</button>
          </div>
        </div>
      )}
      <div className="nav">
        <p>
          GemMind
          <span>
            <FaRobot className="nav-robot" />
          </span>
        </p>
        <div className="profile">
          <div className="dp" onClick={() => setdp_form(prev => !prev)}>
            {profilePicture ? (
              <img src={profilePicture} className="profile-picture" />
            ) : (
              <img src={assets.dp} alt="Default Profile" className="profile-picture" />
            )}
          </div>
          {name}
        </div>
      </div>
      <div className="main-container">
        {!showresult ? (
          <>
            <div className="greet">
              <span>
                <FaRobot className="greet-robot" />
              </span>
              <p>Hello'{name}</p>
              <p className="greet_p2">How can I help you today?</p>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              {/* <img src={assets.dp} alt="" /> */}
              {profilePicture ? (
              <img src={profilePicture} className="result-profile" />
            ) : (
              <img src={assets.dp} alt="Default Profile" className="result-profile" />
            )}
              <p className="entered_prompt">{recentprompt}</p>
            </div>
            <div className="result-data">
              <div>
                <FaRobot className="result_robot" />
              </div>

              {loading ? (
                <>
                  <div className="container">
                    <div className="slice"></div>
                    <div className="slice"></div>
                    <div className="slice"></div>
                    <div className="slice"></div>
                    <div className="slice"></div>
                    <div className="slice"></div>
                  </div>
                </>
              ) : (
                <div className="output">
                  <FaRegCopy className="copy_icon" onClick={copyToClipboard} />
                  <p dangerouslySetInnerHTML={{ __html: resultdata }}></p>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setinput(e.target.value)}
              value={input}
              type="text"
              placeholder="Ask anything"
              onKeyDown={handleKeyDown}
            />
            <div className="input-icons">
              <FaMicrophone
                src={assets.mic}
                alt="Mic"
                id="mic-arrow"
                className={isListening ? "listening" : ""}
                onClick={handleMicClick}
              />
              <FaArrowUp
                onClick={() => handlePromptSubmission()}
                src={assets.send}
                alt="Send"
                id="mic-arrow"
              />
            </div>
          </div>
        </div>
      </div>

    {/* </div> */}
    </> );
};

export default Main;