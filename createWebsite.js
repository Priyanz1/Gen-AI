import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI, Type } from '@google/genai';
const ai = new GoogleGenAI({});
import readlinesync from "readline-sync";
import os from "os";
const platform = os.platform();
import {exec} from "child_process";
import {promisify} from "util";

const asyncExecute=promisify(exec);

async function executeCommand({command}) {
   try{
     const { stdout, stderr } =await asyncExecute(command);

     if (stderr) {
       console.error(`Error: ${stderr}`);
       return `Error: ${stderr}`;
     }
     return `Success: ${stdout} executed successfully.`;
   }catch(err){
    return `Error ${err}`
   }
}

const executeCommandFunctionDeclaration={
name: 'executeCommand',
  description: 'This function executes a single terminal/shell command . A command can be to create a folder ,file,write on file,eedit the file or delete the file.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      command: {
        type: Type.STRING,
        description: 'it will be a single terminal/shell command Ex:mkdir music.',
      }
    },
    required: ['command'],
  },
}   

const functionImplementations = {
  executeCommand
};
const history = [];
const createWebsite=async(input)=>{
    history.push({
        role:'user',
        parts:[{text:input}]
    })
    while(true){
 const response = await ai.models.generateContent({
  model: 'gemini-3-flash-preview',
  contents:history,
  config: {
      systemInstruction:`You are a helpful assistant for creating a website. You can execute terminal/shell commands to create folders, files, write on files, edit files, or delete files. Please provide clear and concise commands to achieve the desired outcome
     current user operating system is:${platform}
      Please provide clear and concise commands to the user according to its operating system to achieve the desired outcome
     
  
      <-- what is your job -->
         1:Analyze the user's request and determine the necessary steps to create the website.
         2:Give them command one by one , step by step
         3:Use available tool executeCommand
        
         //Now you can give them command in following below
         1:To create a folder, Ex:mkdir foldername
         2:To create a folder,create index.html,Ex:touch index.html
         3:then create style.css ,Ex:touch style.css
         4:then create script.js,Ex:touch script.js
         5:then write a code in html file

         you have to provide the terminal/shell command to user, they will directly execute it
     .`, 
    tools: [{
      functionDeclarations: [executeCommandFunctionDeclaration]
    }],
  },
});

if (response.functionCalls && response.functionCalls.length > 0) {
  const Call = response.functionCalls[0]; 
  const name=Call.name;
  const args=Call.args;
  const funcall=functionImplementations[name];
  const result=await funcall(args);

  const functionResponse = {
    name: name,
    response: {
        result:result,
    }
  };
history.push(response.candidates[0].content);
  history.push(
    {
    role: 'user', 
    parts: [{ 
        functionResponse:functionResponse,
     },],
  },);
    continue;
}else {
  history.push({
    role: 'model',
    parts: [{ text: response.text }],
  });
}
console.log(response.text);
break;
}
}

const main=async()=>{
  const input=readlinesync.question("Ask me anything--->: ");
  await createWebsite(input);
  main();
}

main();