const express = require('express');
const http = require('http');
const Server = require('socket.io').Server;
const Connection = require('./db.js');
const Chat = require('./models/Chat.js');
const User = require('./models/User.js');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());

// CORS middleware
app.use(cors());  // Allow all origins (or configure to limit origins)

// Connect to MongoDB
Connection();

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const predefinedChats = [
    {chatId: 'chat1', user: 'Support Team', avatar: 'https://ui-avatars.com/api/?name=Support+Team', owner: 'System'},
    {chatId: 'chat2', user: 'Admin', avatar: 'https://ui-avatars.com/api/?name=Admin', owner: 'System'},
    {chatId: 'chat3', user: 'Bot', avatar: 'https://ui-avatars.com/api/?name=Bot', owner: 'System'}
];
``

// Fetch random quote from ZenQuotes API
const getRandomQuote = async () => {
    try {
        const response = await axios.get('https://zenquotes.io/api/random');
        return `${response.data[0].q} — ${response.data[0].a}`; // Quote and author
    } catch (error) {
        console.error('Error fetching quote:', error);
        return "This is an automatic response!";
    }
}

io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    // Load all chats for the logged-in user
    socket.on("loadChats", async (fullName) => {
            try {
                // Find the user by their name and populate their chats
                let user = await User.findOne({user: fullName}).populate("chats");

                // If the user doesn't exist, create the user and the predefined chats
                if (!user) {

                    // Create a new user with the full name in the 'user' field
                    user = new User({
                        user: fullName,  // Save the full name in the 'user' field
                        chats: [],       // Initialize with predefined chats
                    });

                    await user.save();
                }

                // Clone predefined chats for the user if they don't already have them
                const existingChatIds = user.chats.map(chat => chat.chatId);

                // Create and associate predefined chats with the user if not already present
                for (let predefinedChat of predefinedChats) {
                    const uniqueChatId = `${predefinedChat.chatId}_${user._id}`; // Unique chatId for the user

                    if (!existingChatIds.includes(uniqueChatId)) {
                        // Clone the predefined chat
                        const clonedChat = new Chat({
                            chatId: uniqueChatId,
                            user: predefinedChat.user,
                            avatar: predefinedChat.avatar,
                            owner: predefinedChat.owner,
                            messages: [] // Initialize with an empty array of messages
                        });
                        await clonedChat.save();

                        // Link the cloned chat to the user
                        user.chats.push(clonedChat._id);
                    }
                }

                // Save the user with the updated chat list
                await user.save();

                // Re-populate chats to include newly linked ones
                await user.populate("chats");

                socket.emit("chats", user.chats); // Emit the chats back to the frontend
            } catch (err) {
                console.error("Error loading chats:", err);
                socket.emit("chatLoadError", "Failed to load chats");
            }
        }
    );

// Create a new chat
    socket.on("createChat", async (newChat) => {
        try {
            const {chatId, user: friendName, avatar, owner} = newChat;

            // Create a new chat document
            const createdChat = new Chat({
                chatId,
                user: friendName, // Friend's name
                avatar,
                owner, // Logged-in user's name
                messages: [], // Initialize with an empty array of messages
            });
            await createdChat.save();

            // Find the logged-in user by their name
            let user = await User.findOne({user: owner});

            if (!user) {
                // If the user doesn't exist, create a new record
                user = new User({
                    user: owner,
                    chats: [],
                });
                await user.save();
            }

            // Add the chat to the user's list of chats
            user.chats.push(createdChat._id);
            await user.save();

            // // Re-populate chats to include newly created chat
            // await user.populate("chats");

            // Emit the created chat back to the frontend
            socket.emit("chatCreated", createdChat);
        } catch (err) {
            console.error("Error creating chat:", err);
            socket.emit("chatCreationError", "Internal server error");
        }
    });

// Fetch messages for a specific chat
    socket.on("loadMessages", async (chatId) => {
        try {
            const chat = await Chat.findOne({chatId});
            if (chat) {
                socket.emit("chat", {messages: chat.messages});
            } else {
                socket.emit("chat", {messages: []});
            }
        } catch (err) {
            console.error("Error loading messages:", err);
            socket.emit("messageLoadError", "Failed to load messages");
        }
    });

    socket.on('newMessage', async (msg) => {
        try {
            console.log("New message received from front:", msg);

            // Step 1: Save the user's message to the database
            const chat = await Chat.findOne({chatId: msg.chatId});
            if (chat) {
                chat.messages.push({
                    user: msg.user,
                    message: msg.message,
                    avatar: msg.avatar,
                    timeStamp: msg.timeStamp,
                });
                await chat.save();
            } else {
                console.error("Chat not found for chatId:", msg.chatId);
                return;
            }

            // Emit the user's message to all connected clients
            io.emit('message', msg);

            // Step 2: Prepare and send the automatic response after a 3-second delay
            setTimeout(async () => {
                const quote = await getRandomQuote(); // Fetch a random quote from the ZenQuotes API
                const autoResponse = {
                    chatId: msg.chatId,
                    user: chat.user, // Use the friend's name (stored in the `user` field of the chat)
                    message: quote,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.user)}&background=random`,
                    timeStamp: new Date(),
                };

                console.log("Automatic response sent from back:", autoResponse);

                // Save the automatic response to the database
                chat.messages.push({
                    user: autoResponse.user,
                    message: autoResponse.message,
                    avatar: autoResponse.avatar,
                    timeStamp: autoResponse.timeStamp,
                });
                await chat.save();

                // Emit the automatic response to all connected clients
                io.emit('message', autoResponse);
            }, 3000);
        } catch (err) {
            console.error("Error handling new message:", err);
        }
    });

    // Delete a chat
    socket.on("deleteChat", async ({ chatId, owner }) => {
        try {
            // Find the user who owns the chat
            const user = await User.findOne({ user: owner });

            if (!user) {
                socket.emit("chatDeletionError", "User not found");
                return;
            }

            // Remove the chat from the user's list of chats
            user.chats = user.chats.filter(chat => chat.toString() !== chatId);
            await user.save();

            // Delete the chat document from the database
            await Chat.findByIdAndDelete(chatId);

            // Emit an updated list of chats back to the frontend
            //await user.populate("chats");
            socket.emit("chatDeleted", chatId);
        } catch (err) {
            console.error("Error deleting chat:", err);
            socket.emit("chatDeletionError", "Failed to delete chat");
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    })
})

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

