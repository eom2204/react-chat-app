import socketIOClient from "socket.io-client";

// Create and initialize the socket instance
const socket = socketIOClient("https://react-chat-app-7s7p.onrender.com");

export default socket;

