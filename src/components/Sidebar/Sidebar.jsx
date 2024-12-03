import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { Context } from "../../context/Context";

const Sidebar = () => {
  const [extended, setextended] = useState(false);
  const { onSent, prevprompt, setrecentprompt, newchat, clearHistory } =
    useContext(Context);

  const loadprompt = async (prompt) => {
    setrecentprompt(prompt);
    await onSent(prompt);
  };

  return (
    <div  className="sidebar">
      <div className="top">
        <img
          className="menu"
          onClick={() => setextended((prev) => !prev)}
          src={assets.menu}
          alt=""
        />
        <div onClick={() => newchat()} className="new-chat">
          <img className="plus-img" src={assets.plus} alt="" />
          {extended ? <p>New Chat</p> : null}
        </div>
        {extended ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {prevprompt.length > 0 ? (
              <>
                {prevprompt.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      loadprompt(item);
                    }}
                    className="recent-entry"
                  >
                    <img className="messageimg" src={assets.message} alt="" />
                    <p>{item.slice(0, 18)}...</p>
                  </div>
                ))}
              </>
            ) : (
              <p></p>
            )}
          </div>
        ) : null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <button
            className="clear-history"
            onClick={clearHistory} // Call clearHistory when clicked
          >
            <img src={assets.history} alt="" />
            {extended ? <p>Clear History</p> : null}
          </button>
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.question} alt="" />
          {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting} alt="" />
          {extended ? <p>Setting</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
