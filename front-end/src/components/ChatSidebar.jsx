import { useState, useEffect } from "react";
import NewChatDialog from "./NewChatDialog";
import { io } from "socket.io-client";

const socket = io("http://localhost:3002"); // Initialize socket once at the top

const ChatSidebar = ({ chats, setChats, onSelectChat }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const chatOwner = `${localStorage.getItem("userName")} ${localStorage.getItem("userSurname")}`;

    useEffect(() => {
        // Handle socket events for chat creation
        const handleChatCreated = (createdChat) => {
            setChats((prevChats) => {

                // Check if the chat already exists
                const chatExists = prevChats.some(
                    (chat) => chat.chatId === createdChat.chatId
                );
                if (chatExists) return prevChats;

                // Add the new chat to the list
                return [...prevChats, createdChat];
            });
        };

        socket.on("chatCreated", handleChatCreated);

        // Cleanup listeners when the component unmounts
        return () => {
            socket.off("chatCreated", handleChatCreated);
        };
    }, [setChats]);

    const handleNewChat = (friendName) => {
        if (!friendName.trim()) return;

        // Generate new chat details
        const newChat = {
            user: friendName,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(friendName)}&background=random`,
            chatId: `chat_${Math.random().toString(36).substring(2, 9)}`,
            owner: chatOwner, // Store the logged-in user's name
        };

        // Send new chat to the backend via socket
        socket.emit("createChat", newChat);

        setIsDialogOpen(false); // Close the dialog
    };

    return (
        <div className="chat-sidebar">
            <h3>Hello, {chatOwner}</h3>
            <h4>My chats: </h4>
            <ul className="chat-list">
                {chats.map((chat) => (
                    <li
                        key={chat.chatId}
                        className="chat-item"
                        onClick={() => onSelectChat(chat)}
                    >
                        <img
                            src={chat.avatar || "https://via.placeholder.com/40"}
                            alt={`${chat.user}'s Avatar`}
                            className="friend-avatar"
                        />
                        <span className="friend-name">{chat.user}</span>
                    </li>
                ))}
            </ul>
            <button
                onClick={() => setIsDialogOpen(true)}
                className="new-chat-button"
            >
                New Chat
            </button>
            {isDialogOpen && (
                <NewChatDialog
                    onClose={() => setIsDialogOpen(false)}
                    onSubmit={handleNewChat}
                />
            )}
        </div>
    );
};

export default ChatSidebar;


