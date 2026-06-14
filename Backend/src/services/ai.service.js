import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {HumanMessage,SystemMessage,AIMessage,tool,createAgent} from "langchain";
import * as z from "zod"
import { searchInternet } from "./internet.service.js";
import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.API_KEY,
});

const miModel = new ChatMistralAI({
  model:"mistral-small-latest",
  apiKey:process.env.MISTRAL_API_KEY,
});


const searchInternetTool = tool(
  searchInternet
  ,{
      name:"searchInternet",
      description:"Use this tool to get the latest information from the internet.",
      schema:z.object({
        query:z.string().describe("The search query to look up to the internet.")
      })
  }
)

const agent = createAgent({
  model: model,
  tools:[searchInternetTool],
})


export async function generateResponse(messages) {
        const response = await agent.invoke({
          messages:messages.map(msg => {
          if(msg.role == "user"){
            return new HumanMessage(msg.content);
          }else if(msg.role == "ai"){
            return new AIMessage(msg.content)
          }
        })
        });

        const lastMessageContent = response.messages[response.messages.length - 1].content;
        if (typeof lastMessageContent === "string") {
            return lastMessageContent;
        } else if (Array.isArray(lastMessageContent)) {
            return lastMessageContent
                .map(block => (block.type === "text" ? block.text : ""))
                .join("");
        }
        return "";
}

export async function generateChatTitle(message){
    const response = await miModel.invoke([
        new SystemMessage(`You are a helpfull assistant that generates concise and descriptive titles for chat conversations.
          User will provide you with the frist message of a chat conversation,and you will generate a title that captures the essence of the conversation in 2-4 words.The title should be clear,relevant and engaging,giving users a quick understanding of the chats topic. `),
          new HumanMessage(
            `generate a title for a chat conversation based on the following message: "${message}"`
          )
    ])
    return response.content;
}