import React from "react";
import { useState } from "react";
import "../styles/Home.css";
import { Avatar } from "@mui/material";

const Home = () => {
  const classes = ["Class 1", "Class 2", "Class 3"]; // List of classes
  const [selectedClass, setSelectedClass] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");

  const handleClassSelect = (className) => {
    setSelectedClass(className);
    if (!messages[className]) {
      setMessages((prev) => ({ ...prev, [className]: [] })); // Initialize messages for the selected class
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && selectedClass) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedClass]: [...prevMessages[selectedClass], input],
      }));
      setInput("");
    }
  };

  return (
    <div className="container">
      <div className="class-list">
        <h2>Conversations</h2>
        <ul>
          {classes.map((className, index) => (
            <li
              key={index}
              onClick={() => handleClassSelect(className)}
              style={{ cursor: "pointer" }}
            >
              {className}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-room">
        <h1>{selectedClass ? `${selectedClass} Chat` : "Select a Class"}</h1>
        {selectedClass && (
          <div className="chat-box">
            <div className="messages">
              {messages[selectedClass]?.map((msg, index) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <div key={index} className="message">
                    {msg}
                  </div>
                  <Avatar
                    alt="Remy Sharp"
                    src="/static/images/avatar/1.jpg"
                    style={{ marginLeft: "10px" }}
                  />
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="message-form">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message"
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginRight: "10px",
                }}
              />
              <button type="submit" className="send-button">
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
