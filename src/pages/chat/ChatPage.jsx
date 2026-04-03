import React, { useState } from "react";
import "../../assets/styles/style.css";

import p1 from "../../assets/img/profiles/1.jpg";
import p2 from "../../assets/img/profiles/2.jpg";
import p3 from "../../assets/img/profiles/3.jpg";
import p4 from "../../assets/img/profiles/4.jpg";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Sarah Kortney",
      avatar: p1,
      text: "What do you think about our plans for this product launch?",
      time: "09:25",
      type: "received",
    },
    {
      id: 2,
      sender: "Sarah Kortney",
      avatar: p1,
      text: "It looks like you have a lot planned before your deadline. I would suggest you push your deadline back so you have time to run a successful advertising campaign.",
      time: "09:28",
      type: "received",
    },
    {
      id: 3,
      sender: "Mimi Carreira",
      avatar: p2,
      text: "I would suggest you discuss this further with the advertising team.",
      time: "09:41",
      type: "sent",
    },
    {
      id: 4,
      sender: "Mimi Carreira",
      avatar: p2,
      text: "I am very busy at the moment and on top of everything, I forgot my umbrella today.",
      time: "09:41",
      type: "sent",
    },
  ]);

  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("chat");

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "You",
        avatar: p3,
        text: input,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "sent",
      },
    ]);
    setInput("");
  };

  const chatUsers = [
    { name: "Mical Clark", avatar: p1, time: "10:00pm" },
    { name: "Colin Nathan", avatar: p2, time: "10:10pm" },
    { name: "Nathan Johen", avatar: p3, time: "10:15pm" },
    { name: "Semi Doe", avatar: p4, time: "10:30pm" },
  ];

  const newUsers = [
    { name: "Sarah Kortney", avatar: p1, online: true },
    { name: "Tommy Nash", avatar: p2, online: true },
    { name: "Kathryn Mengel", avatar: p3, online: true },
    { name: "Mayra Sibley", avatar: p4, online: true },
  ];

  return (
    <div className="chat-wrapper">
    
      <div className="chat-list">
        <div className="chat-list-header">
          <button 
            className={activeTab === "chat" ? "active-tab" : ""} 
            onClick={() => setActiveTab("chat")}
          >
            Chat
          </button>
          <button 
            className={activeTab === "new" ? "active-tab" : ""} 
            onClick={() => setActiveTab("new")}
          >
            New
          </button>
        </div>

        <div className="chat-users">
          {activeTab === "chat"
            ? chatUsers.map((user, idx) => (
                <div key={idx} className="chat-user">
                  <img src={user.avatar} alt={user.name} className="avatar" />
                  <div className="user-info">
                    <h6>{user.name}</h6>
                    <span>Nullam facilisis velit.</span>
                  </div>
                  <small>{user.time}</small>
                </div>
              ))
            : newUsers.map((user, idx) => (
                <div key={idx} className="chat-user">
                  <div className="avatar-wrapper">
                    <img src={user.avatar} alt={user.name} className="avatar" />
                    {user.online && <span className="status-dot"></span>}
                  </div>
                  <div className="user-info">
                    <h6>{user.name}</h6>
                  </div>
                </div>
              ))
          }
        </div>
      </div>

    
      <div className="chat-content">
        <div className="chat-header">
          <div className="header-left">
            <img src={p2} alt="Theron Trump" className="avatar large" />
            <div>
              <h5>Theron Trump</h5>
              <span>Last Seen 10:30pm ago</span>
            </div>
          </div>
          <div className="header-actions">
            <span>⋮</span>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.type}`}>
              <img src={msg.avatar} alt={msg.sender} className="avatar" />
              <div className="bubble">
                {msg.text}
                <span className="time">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Say something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>➤</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
