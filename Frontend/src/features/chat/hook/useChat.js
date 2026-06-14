import { initilizeSocketConnnection } from "../services/chat.socket";
import { sendMessage,getChats,getMessages,deleteMessage, } from "../services/chat.api.js";
import { setChats,setCurrentChatId,setError,setIsLoading,createNewChat,addNewMessages,addMessages } from "../chat.slice.js";
import { useDispatch } from "react-redux";


export const useChat = () =>{

    const dispatch = useDispatch();

    async function handleSendMessage({message,chatId}) {
        dispatch(setIsLoading(true));
        try {
            const data = await sendMessage({message,chatId});
            const {chat,aiResponse} = data;
            if(!chatId){
                dispatch(createNewChat({
                    chatId: chat._id,
                    title: chat.title,
                }));
            }
            dispatch(addNewMessages({
                chatId: chat._id,
                content:message,
                role:"user"
            }));
            dispatch(addNewMessages({
                chatId: chat._id,
                content:aiResponse.content,
                role:aiResponse.role
            }));
            dispatch(setCurrentChatId(chat._id));
        } catch (error) {
            console.error("Error in handleSendMessage:", error);
            dispatch(setError(error.message));
        } finally {
            dispatch(setIsLoading(false));
        }
    }


    async function handleGetChats() {
        dispatch(setIsLoading(true))
        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[ chat._id ] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt,
            }
            return acc
        }, {})))
        dispatch(setIsLoading(false))
    }

    async function handleOpenChat(chatId, chats) {

        console.log(chats[ chatId ]?.messages.length)

        if (chats[ chatId ]?.messages.length === 0) {
            const data = await getMessages(chatId)
            const { messages } = data

            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role,
            }))

            dispatch(addMessages({
                chatId,
                messages: formattedMessages,
            }))
        }
        dispatch(setCurrentChatId(chatId))
    }

    return {
        initilizeSocketConnnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    }
}