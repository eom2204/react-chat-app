import { useState, useEffect } from "react";
import NewChatDialog from "./NewChatDialog";
import { io } from "socket.io-client";



const ChatSidebar = ({ chats, setChats, onSelectChat }) => {
    const socket = io("https://react-chat-app-server-five.vercel.app/");
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

        const handleChatDeleted = (deletedChatId) => {
            // Remove the deleted chat from the state
            setChats((prevChats) =>
                prevChats.filter((chat) => chat.chatId !== deletedChatId)
            );
        };

        socket.on("chatCreated", handleChatCreated);
        socket.on("chatDeleted", handleChatDeleted);

        // Cleanup listeners when the component unmounts
        return () => {
            socket.off("chatCreated", handleChatCreated);
            socket.off("chatDeleted", handleChatDeleted);
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

    const handleDeleteChat = (chatId) => {
        const confirmDelete = window.confirm("Are you sure you want to remove this chat?");
        if (confirmDelete) {
            // Emit deleteChat event to the server
            socket.emit("deleteChat", { chatId, chatOwner });
        }
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
                        <button
                            className="delete-chat-button"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the chat selection
                                handleDeleteChat(chat.chatId);
                            }}
                        >
                            X
                        </button>
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


