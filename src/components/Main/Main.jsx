import React, { useContext, useState } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Main = () => {
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

  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in your browser. Try Chrome.");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US"; // Set the language for recognition
    recognition.interimResults = false; // Only return final results
    recognition.continuous = false; // Stop listening after a sentence

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript; // Get the transcribed text
      setinput((prev) => prev + " " + transcript); // Append it to the input field
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start(); // Start listening
  };

  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.dp} alt="" />
      </div>
      <div className="main-container">
        {!showresult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Dev.</span>
              </p>
              <p>How can I help you today?</p>
            </div>
            {/* <div className="cards">
              <div className="card">
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img className="cardimg" src={assets.compass} alt="" />
              </div>
              <div className="card">
                <p>Briefly summarize this concept: urban planning</p>
                <img className="cardimg" src={assets.bulb} alt="" />
              </div>
              <div className="card">
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img className="cardimg" src={assets.message} alt="" />
              </div>
              <div className="card">
                <p>Improve the readability of the following code</p>
                <img className="cardimg" src={assets.code} alt="" />
              </div>
            </div> */}
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.dp} alt="" />
              <p>{recentprompt}</p>
            </div>
            <div className="result-data">
              <img className="geminiimg" src={assets.gemini} alt="" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultdata }}></p>
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
              placeholder="Enter a prompt here"
            />
            <div>
              <img src={assets.gallery} alt="" />
              <img
                src={assets.mic}
                alt="Mic"
                className={isListening ? "listening" : ""}
                onClick={handleMicClick}
              />
              {input ? (
                <img onClick={() => onSent()} src={assets.send} alt="Send" />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its response. Your privacy and Gemini Apps
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
