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

const upload = multer({ dest: "uploads/" });
const supportedLanguages = { en: "English", hi: "Hindi", bn: "Bengali", fr: "French" };

// Optimized Chat Route
// app.post("/chat", async (req, res) => {
//     const { message } = req.body;
//     try {
//         // Improved Language Detection Prompt
//         const langResponse = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [{ 
//                 role: "system", 
//                 content: `Identify the language of the following text accurately. Provide ONLY the language code ('en', 'hi', 'bn', 'fr'). Text: "${message}"` 
//             }],
//             max_tokens: 2
//         });

//         let detectedLanguage = langResponse.choices[0].message.content.trim().toLowerCase();
//         console.log("Detected Language:", detectedLanguage);

//         // Validate language detection
//         if (!supportedLanguages[detectedLanguage]) detectedLanguage = "en"; // Default to English

//         // Step 2: Generate response in detected language
//         const chatResponse = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [
//                 { role: "system", content: `Reply in ${supportedLanguages[detectedLanguage]}.` },
//                 { role: "user", content: message },
//             ],
//             max_tokens: 100
//         });

//         const botReply = chatResponse.choices[0].message.content.trim();

//         res.json({ reply: botReply, language: detectedLanguage });
//     } catch (error) {
//         console.error("Chatbot Error:", error);
//         res.status(500).json({ error: "Something went wrong" });
//     }
// });

app.post("/chat", async (req, res) => {
    const { message } = req.body;
    try {
        // Improved language detection with multiple checks
        const langPrompt = `Analyze the following text and detect its language. Respond with only one of these codes: 'en', 'hi', 'bn', 'fr'. If unsure, still guess the most likely language.\n\nText: "${message}"`;
        
        const langResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: langPrompt }],
            max_tokens: 2
        });

        let detectedLanguage = langResponse.choices[0].message.content.trim().toLowerCase();
        console.log("Detected Language:", detectedLanguage);

        // Second fallback check: Use regex-based detection for Hindi
        if (!supportedLanguages[detectedLanguage]) {
            if (/[\u0900-\u097F]/.test(message)) detectedLanguage = "hi"; // Detects Hindi script
            else detectedLanguage = "en"; // Default to English
        }

        // Step 2: Generate response in detected language
        const chatResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: `Reply in ${supportedLanguages[detectedLanguage]}.` },
                { role: "user", content: message },
            ],
            max_tokens: 100
        });

        const botReply = chatResponse.choices[0].message.content.trim();

        res.json({ reply: botReply, language: detectedLanguage });
    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});




app.listen(5001, () => console.log("Server running on port 5001"));