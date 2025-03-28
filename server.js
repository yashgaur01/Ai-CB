// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const { OpenAI } = require("openai");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Initialize OpenAI API
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// app.post("/chat", async (req, res) => {
//   const { message } = req.body;

//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         { role: "system", content: "Detect the language (English, Hindi, French, or Bangla) and reply in the same language." },
//         { role: "user", content: message },
//       ],
//     });

//     const botReply = response.choices[0].message.content;

//     res.json({ reply: botReply });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

// const PORT = process.env.PORT || 5001; // Changed from 5000 to 5001

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// 2
// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const { OpenAI } = require("openai");
// const say = require("say"); // Text-to-Speech library

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Initialize OpenAI API
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// app.post("/chat", async (req, res) => {
//   const { message } = req.body;

//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         { role: "system", content: "Detect the language (English, Hindi, French, or Bangla) and reply in the same language." },
//         { role: "user", content: message },
//       ],
//     });

//     const botReply = response.choices[0].message.content;

//     // Convert the response to speech (only for English; for other languages, handle separately)
//     say.speak(botReply, "Microsoft Zira", 1.0);

//     res.json({ reply: botReply });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// 3

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const { OpenAI } = require("openai");

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.static(__dirname)); // Serve static files

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // Set up multer for audio uploads
// const upload = multer({ dest: "uploads/" });

// // Handle text chat with language detection & TTS
// app.post("/chat", async (req, res) => {
//     const { message } = req.body;
  
//     try {
//       const response = await openai.chat.completions.create({
//         model: "gpt-4",
//         messages: [
//           { role: "system", content: "Detect the language (English, Hindi, French, or Bangla) and reply in the same language. Just reply in that language without mentioning the detected language explicitly." },
//           { role: "user", content: message },
//         ],
//       });
  
//       const botReply = response.choices[0].message.content;
  
//       // Detect language from the bot's reply
//       let detectedLanguage = "English"; // Default
//       if (/[\u0900-\u097F]/.test(botReply)) detectedLanguage = "Hindi";
//       else if (/[\u0980-\u09FF]/.test(botReply)) detectedLanguage = "Bangla";
//       else if (/[\u00C0-\u017F]/.test(botReply)) detectedLanguage = "French";
  
//       // Convert reply to speech
//       const ttsResponse = await openai.audio.speech.create({
//         model: "tts-1",
//         voice: "alloy",
//         input: botReply,
//       });
  
//       // Save the audio file
//       const audioPath = `tts_output.mp3`;
//       const buffer = Buffer.from(await ttsResponse.arrayBuffer());
//       fs.writeFileSync(audioPath, buffer);
  
//       res.json({ reply: botReply, audio: `http://localhost:5001/${audioPath}`, language: detectedLanguage });
  
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Something went wrong" });
//     }
//   });
  

// // Handle speech-to-text using Whisper
// app.post("/speech-to-text", upload.single("audio"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No audio file uploaded" });
//     }

//     const audioFilePath = req.file.path;

//     // **Transcribe audio using Whisper**
//     const transcription = await openai.audio.transcriptions.create({
//       model: "whisper-1",
//       file: fs.createReadStream(audioFilePath),
//       language: "auto",
//     });

//     // **Cleanup: Delete the uploaded file**
//     fs.unlinkSync(audioFilePath);

//     res.json({ transcript: transcription.text });

//   } catch (error) {
//     console.error("Speech-to-Text Error:", error);
//     res.status(500).json({ error: "Speech recognition failed" });
//   }
// });

// // Serve static audio files
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const { OpenAI } = require("openai");
// const gtts = require("gtts"); // Import Google Text-to-Speech

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.static(__dirname)); // Serve static files

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // Set up multer for audio uploads
// const upload = multer({ dest: "uploads/" });

// // **Supported languages for gTTS**
// const gttsSupportedLanguages = ["en", "hi", "bn", "fr"]; // Ensure 'bn' is included

// // Handle text chat with language detection & TTS
// app.post("/chat", async (req, res) => {
//   const { message } = req.body;

//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         { role: "system", content: "Reply in the same language as the user without mentioning language detection." },
//         { role: "user", content: message },
//       ],
//     });

//     const botReply = response.choices[0].message.content;

//     // **Detect language from the bot's reply**
//     let detectedLanguage = "en"; // Default English
//     if (/[\u0980-\u09FF]/.test(botReply)) {
//       detectedLanguage = "bn"; // Bengali
//     } else if (/[\u0900-\u097F]/.test(botReply)) {
//       detectedLanguage = "hi"; // Hindi
//     } else if (/[À-ſ]/.test(botReply)) {
//       detectedLanguage = "fr"; // French
//     }

//     console.log(`Detected Language: ${detectedLanguage}`);

//     // **Ensure gTTS uses a supported language**
//     if (!gttsSupportedLanguages.includes(detectedLanguage)) {
//       detectedLanguage = "en"; // Default to English if not supported
//     }

//     console.log(`Using gTTS Language: ${detectedLanguage}`);

//     // **Convert reply to speech using gTTS**
//     const audioPath = `tts_output.mp3`;
//     const tts = new gtts(botReply, detectedLanguage);

//     tts.save(audioPath, function (err) {
//       if (err) {
//         console.error("TTS Error:", err);
//         return res.json({ reply: botReply, error: "Text-to-Speech failed, but text is provided.", language: detectedLanguage });
//       }
//       const timestamp = new Date().getTime();
//       res.json({ reply: botReply, audio: `http://localhost:5001/${audioPath}?t=${timestamp}`, language: detectedLanguage });
//     });

//   } catch (error) {
//     console.error("Chatbot Error:", error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

// // **Handle speech-to-text using Whisper**
// app.post("/speech-to-text", upload.single("audio"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No audio file uploaded" });
//     }

//     const audioFilePath = req.file.path;

//     // **Transcribe audio using Whisper**
//     const transcription = await openai.audio.transcriptions.create({
//       model: "whisper-1",
//       file: fs.createReadStream(audioFilePath),
//       language: "auto",
//     });

//     // **Cleanup: Delete the uploaded file**
//     fs.unlinkSync(audioFilePath);

//     res.json({ transcript: transcription.text });

//   } catch (error) {
//     console.error("Speech-to-Text Error:", error);
//     res.status(500).json({ error: "Speech recognition failed" });
//   }
// });

// // Serve static audio files
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Multer setup for audio uploads
const upload = multer({ dest: "uploads/" });

// Supported languages
const supportedLanguages = {
    en: "English",
    hi: "Hindi",
    bn: "Bengali",
    fr: "French"
};

// Handle text chat with TTS
app.post("/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "Reply in the same language as the user without mentioning language detection." },
                { role: "user", content: message },
            ],
        });

        const botReply = response.choices[0].message.content;

        // **Detect Language**
        let detectedLanguage = "en"; // Default English
        if (/[\u0980-\u09FF]/.test(botReply)) {
            detectedLanguage = "bn"; // Bengali
        } else if (/[\u0900-\u097F]/.test(botReply)) {
            detectedLanguage = "hi"; // Hindi
        } else if (/[À-ſ]/.test(botReply)) {
            detectedLanguage = "fr"; // French
        }

        console.log(`Detected Language: ${detectedLanguage}`);

        if (!supportedLanguages[detectedLanguage]) {
            detectedLanguage = "en"; // Default to English if unsupported
        }

        console.log(`Using TTS Language: ${detectedLanguage}`);

        // **Convert reply to speech using Python gTTS**
        const audioPath = `tts_output.mp3`;
        const sanitizedReply = botReply.replace(/["']/g, ""); // Remove quotes to avoid syntax errors
const command = `python3 -c "from gtts import gTTS; tts = gTTS('''${sanitizedReply}''', lang='${detectedLanguage}'); tts.save('${audioPath}')"`;


        exec(command, (error) => {
            if (error) {
                console.error("TTS Error:", error);
                return res.json({ reply: botReply, error: "TTS failed, text provided.", language: detectedLanguage });
            }
            const timestamp = new Date().getTime();
            res.json({ reply: botReply, audio: `http://localhost:5001/${audioPath}?t=${timestamp}`, language: detectedLanguage });
        });

    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Serve static audio files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
    res.send("Chatbot Backend is Running!");
  });
  