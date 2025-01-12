import {useEffect, useState} from "react";
import socketIOClient from "socket.io-client";
import ChatBox from "./ChatBox.jsx";
import InputText from "./InputText";
import UserLogin from "./UserLogin";
import ChatSidebar from "./ChatSidebar.jsx";

const ChatContainer = ({user, setUser}) => {
    const socket = socketIOClient("https://react-chat-app-server-five.vercel.app/");
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null); // Current active chat
    const [messages, setMessages] = useState([]);


    useEffect(() => {

        if (user) {
            // Load all chats for the user
            socket.emit("loadChats", user);

            // Define the callbacks for socket events
            const handleChats = (loadedChats) => {
                setChats((prevChats) => {
                    // Combine existing chats with new ones, avoiding duplicates
                    const combinedChats = [...prevChats];
                    loadedChats.forEach((newChat) => {
                        if (!combinedChats.some((chat) => chat.chatId === newChat.chatId)) {
                            combinedChats.push(newChat);
                        }
                    });
                    return combinedChats;
                });
            };

            const handleMessage = (newMessage) => {
                // Only add messages for the current chat
                if (newMessage.chatId === currentChat?.chatId) {
                    setMessages((prevMessages) => {
                        // Check for duplicates by comparing timestamp and username
                        const isDuplicate = prevMessages.some(
                            (msg) =>
                                msg.timeStamp === newMessage.timeStamp &&
                                msg.user === newMessage.user
                        );
                        return isDuplicate ? prevMessages : [...prevMessages, newMessage];
                    });
                }
            }

            // Attach the listeners
            socket.on("chats", handleChats);
            socket.on("message", handleMessage);

            // Cleanup function to remove listeners
            return () => {
                socket.off("chats", handleChats);
                socket.off("message", handleMessage);
            };
        }
    }, [user, currentChat?.chatId]); // Update the dependency to include currentChat

    const addMessage = (messageText) => {
        if (!currentChat) return;

        const newMessage = {
            chatId: currentChat.chatId,
            user,
            message: messageText,
            avatar: localStorage.getItem("avatar"),
            timeStamp: new Date(),
        };

        // Emit the new message to the backend
        socket.emit("newMessage", newMessage);

        // // Optimistically update the messages state
        // setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const handleSelectChat = (chat) => {
        setCurrentChat(chat);
        setMessages([]); // Clear messages while loading

        // Emit the event to load messages for the selected chat
        socket.emit("loadMessages", chat.chatId);

        // Remove any previous "chat" listener to prevent duplication
        socket.off("chat");

        // Listen for the loaded messages for the selected chat
        socket.on("chat", (loadedMessages) => {
            setMessages(loadedMessages.messages || []);
        });
    }

    const Logout = () => {
        localStorage.removeItem("chatId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userSurname");
        localStorage.removeItem("avatar");
        setUser("");
    };


    console.log("USER has full name?", user);

    return (
        <div className="chat-container">
            {user ? (
                <div className="chat-layout">
                    <ChatSidebar
                        chats={chats}
                        setChats={setChats}
                        onSelectChat={handleSelectChat}/>
                    <div className="chat-main">
                        <div className="chats_header">
                            <h4>Chatting with {currentChat ? currentChat.user : "No one selected"}</h4>
                            <p className="chats_logout" onClick={Logout}>
                                <strong>Logout</strong>
                            </p>
                        </div>
                        <ChatBox chats={messages}/>
                        <InputText addMessage={addMessage}/>
                    </div>
                </div>
            ) : (
                <UserLogin setUser={setUser}/>
            )}
        </div>
    );
};

export default ChatContainer;


