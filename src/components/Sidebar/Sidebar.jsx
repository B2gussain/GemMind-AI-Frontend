import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import { RiMenu2Line } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { FaHistory } from "react-icons/fa";

const Sidebar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const sidebar_ref = useRef(null);
  const [extended, setextended] = useState(true);
  const [prompts, setPrompts] = useState([]);
  const { onSent, prevprompt, setrecentprompt, newchat, clearHistory } =
    useContext(Context);

  // Fetch user's prompts when the sidebar component is mounted
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch('http://localhost:4000/gemini/prompts', {
          method: 'GET',
          headers: {
            'Authorization': token, // Send token directly as it already includes 'Bearer'
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch prompts');
        }

        const data = await response.json();
        if (data && data.prompts) {
          setPrompts([...data.prompts].reverse());
        }
      } catch (error) {
        console.error("Error fetching prompts:", error);
      }
      // console.log(prompts )
    };

    if (token) {
      fetchPrompts();
    }
  }, [token,prevprompt]); // Add prevprompt as dependency to refresh when new prompts are added

  const loadprompt = async (prompt) => {
    setrecentprompt(prompt);
    await onSent(prompt);
  };

  const sidebar_collaps = () => {
    setextended((prev) => {
      const newExtendedState = !prev;
      if (sidebar_ref.current) {
        sidebar_ref.current.style.left = newExtendedState ? "-100%" : "0%";
      }
      return newExtendedState;
    });
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to log out?"
    );
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      navigate("/");
    }
  };

  return (
    <>
      <RiMenu2Line className="menu-icon" onClick={sidebar_collaps} />
      <div ref={sidebar_ref} className="extend-sidebar">
        <div className="top">
          <div onClick={newchat} className="new-chat">
            <img className="plus-img" src={assets.plus} alt="" />
            <Link className="link" to="/home">New Chat</Link>
          </div>
         
            <div className="recent">
              <p className="recent-title">Recent</p>
              {prompts && prompts.length > 0 ? (
                <>
                  {prompts.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => loadprompt(item.prompt)}
                      className="recent-entry"
                    >
                      <img
                        className="messageimg"
                        src={assets.message}
                        alt=""
                      />
                      <p>{item.prompt.slice(0, 20)}...</p>
                    </div>
                  ))}
                </>
              ) : (
                <p className="no-prompts">No recent prompts</p>
              )}
            </div>
        </div>
        <div className="bottom">
          <div className="bottom-item recent-entry">
            <button className="clear-history" onClick={clearHistory}>
              <FaHistory className="sidebar-icon" />
              <Link className="link"  to="/history">Clear History</Link>
            </button>
          </div>
          <div className="bottom-item recent-entry">
            <button
              className="clear-history log-out"
              onClick={handleLogout}
            >
              <CiLogout className="sidebar-icon" />
              <p>Log Out</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;