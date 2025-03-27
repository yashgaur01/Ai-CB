// import React, { useState } from "react";
// import axios from "axios";
// import "./App.css";


// function App() {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);

//   const languageVoices = {
//     English: "en-US",
//     Hindi: "hi-IN",
//     French: "fr-FR",
//     Bangla: "bn-BD"
//   };

//   const speak = (text, language) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = languageVoices[language] || "en-US";
//     speechSynthesis.speak(utterance);
//   };

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const newMessages = [...messages, { sender: "User", text: input }];
//     setMessages(newMessages);
//     setInput("");

//     try {
//       const { data } = await axios.post("http://localhost:5001/chat", { message: input });
//       if (data.error) {
//         alert("Unsupported language detected!");
//         return;
//       }

//       setMessages([...newMessages, { sender: "Bot", text: data.reply }]);
//       speak(data.reply, data.language);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const startListening = () => {
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     recognition.lang = "en-US";
//     recognition.start();
    
//     recognition.onresult = (event) => {
//       const speechText = event.results[0][0].transcript;
//       setInput(speechText);
//       handleSend();
//     };

//     recognition.onerror = (event) => {
//       console.error("Speech recognition error", event.error);
//     };
//   };

//   return (
//     <div className="chat-container">
//       <h2 className="title">Ai Chatbot</h2>
//       <div className="chat-box">
//         {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.sender === "User" ? "user" : "bot"}`}>
//             <strong>{msg.sender}:</strong> {msg.text}
//           </div>
//         ))}
//       </div>
//       <div className="input-container">
//         <input 
//           type="text" 
//           value={input} 
//           onChange={(e) => setInput(e.target.value)} 
//           placeholder="Type a message..."
//           className="chat-input"
//         />
//         <button onClick={handleSend} className="send-button">Send</button>
//         <button onClick={startListening} className="voice-button">🎤</button>
//       </div>
//     </div>
//   );
// }

// export default App;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./App.css";

// function App() {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [listening, setListening] = useState(false);

//   const languageVoices = {
//     English: "en-US",
//     Hindi: "hi-IN",
//     Bengali: "bn-IN",
//     French: "fr-FR"
//   };

//   // Speak function with improved voice selection
//   const speak = (text, language) => {
//     if (!text) return;

//     speechSynthesis.cancel(); // Stop any ongoing speech
//     const utterance = new SpeechSynthesisUtterance(text);

//     // Set the language voice
//     utterance.lang = languageVoices[language] || "en-US";

//     // Find an appropriate voice
//     const voices = speechSynthesis.getVoices();
//     const selectedVoice = voices.find((v) => v.lang === utterance.lang);

//     if (selectedVoice) {
//         utterance.voice = selectedVoice;
//     } else {
//         console.warn(`No voice found for ${language}, using default.`);
//     }

//     speechSynthesis.speak(utterance);
//   };

//   useEffect(() => {
//     speechSynthesis.onvoiceschanged = () => {
//       console.log("Voices loaded:", speechSynthesis.getVoices());
//     };
//   }, []);

//   // Handle user input and API call
//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const newMessages = [...messages, { sender: "User", text: input }];
//     setMessages(newMessages);
//     setInput("");

//     try {
//       const { data } = await axios.post("http://localhost:5001/chat", { message: input });

//       if (data.error) {
//         alert("Error: " + data.error);
//         return;
//       }

//       setMessages([
//         ...newMessages, 
//         { sender: "Bot", text: data.reply, language: data.language }
//       ]);

//       speak(data.reply, data.language);
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Something went wrong. Please try again.");
//     }
//   };

//   // Start voice recognition with language auto-detection
//   const startListening = () => {
//     if (listening) return; // Prevent multiple recognition instances
//     setListening(true);

//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     recognition.lang = "en-US"; // Default language

//     recognition.start();
    
//     recognition.onresult = (event) => {
//       const speechText = event.results[0][0].transcript;
//       setInput(speechText);
//       handleSend();
//     };

//     recognition.onspeechend = () => {
//       recognition.stop();
//       setListening(false);
//     };

//     recognition.onerror = (event) => {
//       console.error("Speech recognition error:", event.error);
//       setListening(false);
//       alert("Speech recognition error: " + event.error);
//     };
//   };

//   return (
//     <div className="chat-container">
//       <h2 className="title">AI Chatbot</h2>
//       <div className="chat-box">
//         {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.sender === "User" ? "user" : "bot"}`}>
//             <strong>{msg.sender}:</strong> {msg.text}
//             {msg.language && msg.sender === "Bot" && (
//               <span className="language-label">({msg.language})</span>
//             )}
//           </div>
//         ))}
//       </div>
//       <div className="input-container">
//         <input 
//           type="text" 
//           value={input} 
//           onChange={(e) => setInput(e.target.value)} 
//           placeholder="Type a message..."
//           className="chat-input"
//         />
//         <button onClick={handleSend} className="send-button">Send</button>
//         <button onClick={startListening} className={`voice-button ${listening ? "active" : ""}`}>
//           🎤
//         </button>
//       </div>
//     </div>
//   );
// }

// export default App;




import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);

  const languageVoices = {
    English: "en-US",
    Hindi: "hi-IN",
    Bengali: "bn-IN",
    French: "fr-FR"
  };

  // Speak function with improved voice selection
  const speak = (text, language) => {
    if (!text) return;

    speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);

    // Set the language voice
    utterance.lang = languageVoices[language] || "en-US";

    // Get all available voices
    const voices = speechSynthesis.getVoices();
    console.log("Available Voices:", voices); // Debugging

    // Check for a specific voice supporting Bengali
    let selectedVoice = voices.find((v) => v.lang.includes("bn")) || voices.find((v) => v.lang.includes("en"));

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    } else {
        console.warn(`No Bengali voice found, using default.`);
    }

    speechSynthesis.speak(utterance);
};


  useEffect(() => {
    speechSynthesis.onvoiceschanged = () => {
      console.log("Voices loaded:", speechSynthesis.getVoices());
    };
  }, []);

  // Handle user input and API call
  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "User", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const { data } = await axios.post("http://localhost:5001/chat", { message: input });

      if (data.error) {
        alert("Error: " + data.error);
        return;
      }

      setMessages([
        ...newMessages, 
        { sender: "Bot", text: data.reply, language: data.language }
      ]);

      speak(data.reply, data.language);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Start voice recognition with language auto-detection
  const startListening = () => {
    if (listening) return; // Prevent multiple recognition instances
    setListening(true);

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US"; // Default language

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
