import { createContext, useState } from "react";
import run from "../config/gemini";
export const Context = createContext();
const ContextProvider = (props) => {
  const [input, setinput] = useState("");
  const [recentprompt, setrecentprompt] = useState("");
  const [prevprompt, setprevprompt] = useState([]);
  const [showresult, setshowresult] = useState(false);
  const [loading, setloading] = useState(false);
  const [resultdata, setresultdata] = useState("");

  const delaypara = (index, nextword) => {
    setTimeout(function () {
      setresultdata((prev) => prev + nextword);
    }, 75 * index);
  };
  const newchat=()=>{
    setloading(false)
    setshowresult(false)

  }

  const onSent = async (prompt) => {
    setresultdata("");
    setloading(true);
    setshowresult(true);
    let response;
    if (prompt !== undefined) {
      response = await run(prompt);
      setrecentprompt(prompt);
    }
    else{
      setprevprompt((prev) => [...prev, input]);
      setrecentprompt(input)
      response=await run(input)
      console.log(response)
    }

    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newResponse.split("*").join("</br>");
    let newResponseArray = newResponse2.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextword = newResponseArray[i];
      delaypara(i, nextword + " ");
    }
    setloading(false);
    setinput("");
  };

  const contextValue = {
    prevprompt,
    setprevprompt,
    onSent,
    setrecentprompt,
    recentprompt,
    showresult,
    loading,
    resultdata,
    input,
    setinput,
    newchat
  };
  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};
export default ContextProvider;
