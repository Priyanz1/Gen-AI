import dotenv from "dotenv";
dotenv.config();
import readlinesync from "readline-sync";

const sum=({num1,num2})=>{
    return num1+num2;
}
const sub=({num1,num2})=>{
    return num1-num2;
}
const mul=({num1,num2})=>{
    return num1*num2;
}   
const div=({num1,num2})=>{
    if(num2===0){
        return "Error: Division by zero is not allowed.";
    }   
    return num1/num2;
}
import { GoogleGenAI, Type } from '@google/genai';

const sumD = {
  name: 'sum',
  description: 'this function return sum of num1 and num2 which he get from argument.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      num1: {
        type: Type.NUMBER,
        description: 'First number to be added',
      },
      num2: {
        type: Type.NUMBER,
        description: 'Second number to be added',
      },
    },
    required: ['num1', 'num2'],
  },
};
    
const subD = {
  name: 'sub',
  description: 'this function return difference of num1 and num2 which he get from argument.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      num1: {
        type: Type.NUMBER,
        description: 'First number to be subtracted',
      },
      num2: {
        type: Type.NUMBER,
        description: 'Second number to be subtracted',
      },
    },
    required: ['num1', 'num2'],
  },
};
const mulD = {
  name: 'mul',
  description: 'this function return product of num1 and num2 which he get from argument.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      num1: {
        type: Type.NUMBER,
        description: 'First number to be multiplied',
      },
      num2: {
        type: Type.NUMBER,
        description: 'Second number to be multiplied',
      },
    },
    required: ['num1', 'num2'],
  },
};
const divD = {
  name: 'div',
  description: 'this function return quotient of num1 and num2 which he get from argument.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      num1: {
        type: Type.NUMBER,
        description: 'First number to be divided',
      },
      num2: {
        type: Type.NUMBER,
        description: 'Second number to be divided',
      },
    },
    required: ['num1', 'num2'],
  },
};

const history = [];
const functionImplementations = { sum, sub, mul, div };
const config= {
  systemInstruction:`You are an Agent,you have access of 4 available tools who like to find sum of 2 number,subtraction of two number,multiplication of two numder and division of two numbers .
  Use these tools whenever required to confrim user query.
  If user ask general question then answer them without using tools but if user ask any question related to sum,sub,mul,div then use these tools to answer them.
  `,
   tools: [{
      functionDeclarations: [sumD, subD, mulD, divD],
    }],
};
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const runAgent=async(input)=>{
    history.push({
    role: 'user',
    parts: [{ text: input }],
  });

  while(true){

const response = await ai.models.generateContent({
  model: 'gemini-3-flash-preview',
  contents: history,
  config: config,
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
} else {
  history.push({
    role: 'model',
    parts: [{ text: response.text }],
  });
}
console.log(response.text);
break;
}
}

async function main(){
const input=readlinesync.question("Ask me anything--->: ");
await runAgent(input);
main();
}

main();




// import dotenv from "dotenv";
// dotenv.config();

// import readlinesync from "readline-sync";
// import { GoogleGenAI, Type } from "@google/genai";

// const sum = ({ num1, num2 }) => num1 + num2;
// const sub = ({ num1, num2 }) => num1 - num2;
// const mul = ({ num1, num2 }) => num1 * num2;
// const div = ({ num1, num2 }) => {
//   if (num2 === 0) {
//     return "Error: Division by zero is not allowed.";
//   }
//   return num1 / num2;
// };

// const sumD = {
//   name: "sum",
//   description: "Return sum of num1 and num2.",
//   parameters: {
//     type: Type.OBJECT,
//     properties: {
//       num1: { type: Type.NUMBER, description: "First number" },
//       num2: { type: Type.NUMBER, description: "Second number" },
//     },
//     required: ["num1", "num2"],
//   },
// };

// const subD = {
//   name: "sub",
//   description: "Return difference of num1 and num2.",
//   parameters: {
//     type: Type.OBJECT,
//     properties: {
//       num1: { type: Type.NUMBER, description: "First number" },
//       num2: { type: Type.NUMBER, description: "Second number" },
//     },
//     required: ["num1", "num2"],
//   },
// };

// const mulD = {
//   name: "mul",
//   description: "Return product of num1 and num2.",
//   parameters: {
//     type: Type.OBJECT,
//     properties: {
//       num1: { type: Type.NUMBER, description: "First number" },
//       num2: { type: Type.NUMBER, description: "Second number" },
//     },
//     required: ["num1", "num2"],
//   },
// };

// const divD = {
//   name: "div",
//   description: "Return quotient of num1 and num2.",
//   parameters: {
//     type: Type.OBJECT,
//     properties: {
//       num1: { type: Type.NUMBER, description: "First number" },
//       num2: { type: Type.NUMBER, description: "Second number" },
//     },
//     required: ["num1", "num2"],
//   },
// };

// const history = [];
// const functionImplementations = { sum, sub, mul, div };

// const config = {
//   tools: [
//     {
//       functionDeclarations: [sumD, subD, mulD, divD],
//     },
//   ],
// };

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const runAgent = async (input) => {
//   history.push({
//     role: "user",
//     parts: [{ text: input }],
//   });

//   while (true) {
//     const response = await ai.models.generateContent({
//       model: "gemini-3-flash-preview",
//       contents: history,
//       config,
//     });

//     if (response.functionCalls && response.functionCalls.length > 0) {
//       const call = response.functionCalls[0];
//       const name = call.name;
//       const args = call.args;

//       const func = functionImplementations[name];
//       const result = await func(args);

//       // Push complete model content back to preserve signatures/context
//       history.push(response.candidates[0].content);

//       // Push function response in correct format
//       history.push({
//         role: "user",
//         parts: [
//           {
//             functionResponse: {
//               name: name,
//               response: {
//                 result: result,
//               },
//             },
//           },
//         ],
//       });
//     } else {
//       history.push({
//         role: "model",
//         parts: [{ text: response.text }],
//       });

//       console.log("AI:", response.text);
//       break;
//     }
//   }
// };

// async function main() {
//   while (true) {
//     const input = readlinesync.question("Ask me anything --->: ");

//     if (input.toLowerCase() === "exit") {
//       console.log("Bye bhai");
//       break;
//     }

//     await runAgent(input);
//   }
// }

// main().catch((err) => {
//   console.error("Error:", err);
// });