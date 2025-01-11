import React, { useState } from "react";

const NewChatDialog = ({ onClose, onSubmit }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!firstName || !lastName) {
            setError("Both fields are required!");
            return;
        }

        const friendName = `${firstName} ${lastName}`;
        onSubmit(friendName); // Pass the friend's name to the parent
        setError(""); // Clear errors
    };

    return (
        <div className="dialog-overlay">
            <div className="dialog">
                <h2>Start a New Chat</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <div className="dialog-actions">
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit">Start Chat</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewChatDialog;
