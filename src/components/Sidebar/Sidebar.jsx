
import "./sidebar.css";
import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { Context } from "../../context/Context";
const Sidebar = () => {
    const [extended, setextended] = useState(false)
    const { onSent, prevprompt, setrecentprompt,newchat } = useContext( Context )
const loadprompt=async (prompt)=>{
    setrecentprompt(prompt)
    await onSent(prompt)
}
    return (
        <div className="sidebar">
            <div className="top">
                <img className="menu" onClick={() => setextended(prev => !prev)} src={assets.menu} alt="" />
                <div onClick={()=>newchat()} className="new-chat">
                    <img src={assets.plus} alt="" />
                    {extended ? <p>New Chat</p> : null}
                </div>
                {extended ? <div className="recent">
                    <p className="recent-title">Recent</p>
                    {prevprompt.map((item,index)=>{
                        return (
                            <div onClick={()=>{
                                loadprompt(item)
                            }} className="recent-entry">
                            <img src={assets.message} alt="" />
                            <p>{item.slice(0,18)}...</p>
                        </div>)

                    })}

                  
                </div> : null}
            </div>
            <div className="bottom">
                <div className="bottom-item recent-entry">
                    <img src={assets.question} alt="" />
                    {extended ? <p>Help</p> : null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.history} alt="" />
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
