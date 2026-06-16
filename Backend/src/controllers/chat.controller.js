import { generateResponse,generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req,res) {
    try {
        const {message,chat:chatId} = req.body;
        
        let title = null,chat = null;

        if (chatId) {
            chat = await chatModel.findOne({ _id: chatId, user: req.user.id });
        }

        if(!chat){
            title = await generateChatTitle(message);

            chat = await chatModel.create({
                user:req.user.id,
                title
            })
        }
        
        const userMessage = await messageModel.create({
            chat: chat._id,
            content:message,
            role:"user"
        })

        const messages = await messageModel.find({chat: chat._id});

        const result = await generateResponse(messages);

        const aiResponse = await messageModel.create({
            chat: chat._id,
            content:result,
            role:"ai"
        })

        res.status(201).json({
            aiMessage : result,
            title,
            chat,
            aiResponse
        })
    } catch (error) {
        console.error("sendMessage error:", error.message || error);
        res.status(500).json({
            message: "Failed to generate AI response",
            error: error.message
        });
    }
}


export async function getChats(req,res){
    try {
        const user = req.user;

        const chats = await chatModel.find({user : user.id});

        res.status(200).json({
            message:"chats received successfully",
            chats
        });
    } catch (error) {
        console.error("getChats error:", error.message || error);
        res.status(500).json({
            message: "Failed to fetch chats",
            error: error.message
        });
    }
};


export async function getMessages(req,res){
    try {
        const {chatId} = req.params;

        const chat = await chatModel.findOne({
            _id: chatId,
            user: req.user.id
        });

        if(!chat){
            return res.status(404).json({
                message:"Chat not found!!"
            });
        };

        const messages = await messageModel.find({
            chat:chatId
        });

        res.status(200).json({
            message:"message received successfully",
            messages
        });
    } catch (error) {
        console.error("getMessages error:", error.message || error);
        res.status(500).json({
            message: "Failed to fetch messages",
            error: error.message
        });
    }
}


export async function deleteChat(req,res){
    try {
        const {chatId} = req.params;

        const chat = await chatModel.findOneAndDelete({
            _id:chatId,
            user:req.user.id
        });

        await messageModel.deleteMany({
            chat : chatId
        });

        if(!chat){
            return res.status(404).json({
                message:"Chat not found"
            });
        };

        res.status(200).json({
            message:"chat deleted successfully"
        })
    } catch (error) {
        console.error("deleteChat error:", error.message || error);
        res.status(500).json({
            message: "Failed to delete chat",
            error: error.message
        });
    }
}