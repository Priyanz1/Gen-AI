

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