import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.API_KEY,
});


// export async function testAi(){
//     await model.invoke("What is the capital of India?").then((response) => {
//         console.log(response.content);
//       }).catch((error) => {
//         console.error(error);
//       });   
// }