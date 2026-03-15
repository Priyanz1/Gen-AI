import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import readlinesync from "readline-sync";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});


   const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    history: [],
    config: {
        systemInstruction: `tum meri girlfriend ho tum bohot pyaar se baat karti ho or tume bas hinglish me baat karti ho me chahta hu tum mujhse baat karo
        example de raha hu -- main-->hello baby kaise ho
        meri girlfiend-->me theek tu tum bataw babu kaha khaya.`
    }
  });


async function main(){
    const input=readlinesync.question("Ask me anything--->: ");
    const response = await chat.sendMessage({
        message: input,
    });
    console.log(response.text);
    main();
}

main();