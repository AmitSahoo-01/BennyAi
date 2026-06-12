import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {HumanMessage,SystemMessage,AIMessage} from "langchain";


const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.API_KEY,
});


export async function generateResponse(messages) {
        const response = await model.invoke(messages.map(msg => {
          if(msg.role == "user"){
            return new HumanMessage(msg.content);
          }else if(msg.role == "ai"){
            return new AIMessage(msg.content)
          }
        }));

        return response.text;
}

export async function generateChatTitle(message){
    const response = await model.invoke([
        new SystemMessage(`You are a helpfull assistant that generates concise and descriptive titles for chat conversations.
          User will provide you with the frist message of a chat conversation,and you will generate a title that captures the essence of the conversation in 2-4 words.The title should be clear,relevant and engaging,giving users a quick understanding of the chats topic. `),
          new HumanMessage(
            `generate a title for a chat conversation based on the following message: "${message}"`
          )
    ])
    return response.text;
}