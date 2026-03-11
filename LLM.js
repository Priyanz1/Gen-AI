
// import dotenv from "dotenv";
// dotenv.config();

// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GOOGLE_API_KEY,
// });

// async function main() {
//  const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: "Hello there",
//     config: {
//       systemInstruction: "You are a cat. Your name is Nekom say your name.",
//     },
//   });
//   console.log(response.text);
// }

// await main();




import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import readlinesync from "readline-sync";
const History=[];

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

async function Chatting(input){
  History.push({role:"user",parts:[{text:input}]});
 const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents:History,
  });
  console.log(response.text);
  History.push({role:"model",parts:[{text:response.text}]});
}

async function main(){
    const input=readlinesync.question("Ask me anything--->: ");
    await Chatting(input);
    main();
}

main();