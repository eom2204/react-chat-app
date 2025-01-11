import {useEffect, useState} from "react";
import ChatContainer from "./components/ChatContainer"
import UserLogin from "./components/UserLogin"


function App() {
    const [user, setUser] = useState("");

    // Check if the user is already logged in when the app loads
    useEffect(() => {
        const userName = localStorage.getItem("userName");
        const userSurname = localStorage.getItem("userSurname");

        if (userName && userSurname) {
            setUser(`${userName} ${userSurname}`);
        } else {
            setUser(""); // Ensure `user` is empty when not logged in
        }
    }, []);

    console.log("User in App.jsx:", user);

    return (
        <div className="App">
            {user ? (
                <ChatContainer user={user} setUser={setUser} />
            ) : (
                <UserLogin setUser={setUser} />
            )}
        </div>
    );
}

export default App;
