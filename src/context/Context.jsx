import { createContext, useState, useEffect } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setinput] = useState("");
  const [recentprompt, setrecentprompt] = useState("");
  const [prevprompt, setprevprompt] = useState([]);
  const [showresult, setshowresult] = useState(false);
  const [loading, setloading] = useState(false);
  const [resultdata, setresultdata] = useState("");
  // Load previous prompts from local storage on app load
  useEffect(() => {
    const storedPrompts = JSON.parse(localStorage.getItem("prevprompt")) || [];
    setprevprompt(storedPrompts);
  }, []);

  // Save updated prompts to local storage whenever prevprompt changes
  useEffect(() => {
    localStorage.setItem("prevprompt", JSON.stringify(prevprompt));
  }, [prevprompt]);

  const clearHistory = () => {
    setprevprompt([]); // Clear the state
    localStorage.removeItem("prevprompt"); // Remove from local storage
  };

  const newchat = () => {
    setloading(false);
    setshowresult(false);
  };
  const onSent = async (prompt) => {
    setresultdata("");
    setloading(true);
    setshowresult(true);
    let response;
  
    if (prompt !== undefined) {
      response = await run(prompt);
      setrecentprompt(prompt);
    } else {
      setprevprompt((prev) => [input, ...prev]); // Add new prompt to the beginning of the array
      setrecentprompt(input);
      response = await run(input);
      console.log(response);
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
  

  const delaypara = (index, nextword) => {
    setTimeout(function () {
      setresultdata((prev) => prev + nextword);
    }, 10 * index);
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
    newchat,
    clearHistory,
   // Add clearHistory to the context
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
