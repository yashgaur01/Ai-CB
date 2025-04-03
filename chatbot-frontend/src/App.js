import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const voicesRef = useRef([]);
  


  const languageVoices = {
    en: "en-US",
    hi: "hi-IN",
    bn: "bn-IN",
    fr: "fr-FR"
  };

  // Speak function with improved voice selection
  // const speak = (text, language) => {
  //   if (!text) return;
  //   console.time("Speech Synthesis Time");
  
  //   const utterance = new SpeechSynthesisUtterance(text);
  //   utterance.lang = languageVoices[language] || "en-US";
  
  //   // Prioritize high-quality voices
  //   let selectedVoice = voicesRef.current.find(v => v.name.includes("Google UK English Female")) ||
  //                       voicesRef.current.find(v => v.name.includes("Microsoft Hazel - English (United Kingdom)")) ||
  //                       voicesRef.current.find(v => v.lang.includes(language)) ||
  //                       voicesRef.current[0];
  
  //   if (selectedVoice) utterance.voice = selectedVoice;
    
  //   speechSynthesis.speak(utterance);
  //   console.timeEnd("Speech Synthesis Time");
  // };
  const speak = (text, language) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageVoices[language] || "en-US";

    let selectedVoice = voicesRef.current.find(v => v.lang.startsWith(languageVoices[language])) ||
                        voicesRef.current.find(v => v.lang.includes(language)) ||
                        voicesRef.current[0];

    if (selectedVoice) utterance.voice = selectedVoice;

    speechSynthesis.speak(utterance);
};

  

  useEffect(() => {
    const updateVoices = () => {
      voicesRef.current = speechSynthesis.getVoices();
      console.log("Updated voices:", voicesRef.current.map(v => v.name));
    };
    
    speechSynthesis.onvoiceschanged = updateVoices;
    updateVoices(); // Call initially in case voices are available
  
    return () => { speechSynthesis.onvoiceschanged = null; };
  }, []);
  
  // Handle user input and API call
  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "User", text: input }];
    setMessages(newMessages);
    setInput("");

    console.time("API Request Time");
    try {
      const { data } = await axios.post("http://localhost:5001/chat", { message: input });
      console.timeEnd("API Request Time");

      if (data.error) {
        alert("Error: " + data.error);
        return;
      }

      setMessages([...newMessages, { sender: "Bot", text: data.reply, language: data.language }]);
      speak(data.reply, data.language);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Start voice recognition with language auto-detection
  const startListening = () => {
    if (listening) return;
    setListening(true);

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    
    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setInput(speechText);
      handleSend();
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
      alert("Speech recognition error: " + event.error);
    };
  };

  return (
    <div className="chat-container">
      <h2 className="title">AI Chatbot</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === "User" ? "user" : "bot"}`}>
            <strong>{msg.sender}:</strong> {msg.text}
            {msg.language && msg.sender === "Bot" && (
              <span className="language-label">({msg.language})</span>
            )}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type a message..."
          className="chat-input"
        />
        <button onClick={handleSend} className="send-button">Send</button>
        <button onClick={startListening} className={`voice-button ${listening ? "active" : ""}`}>
          🎤
        </button>
      </div>
    </div>
  );
}


export default App;

