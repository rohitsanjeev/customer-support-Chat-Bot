import axios from 'axios'; // Add this import at the top of your file

import './Chatbot.css';


import React, { useState } from 'react';



const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  
  const handleMessageChange = (e) => setMessage(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;

    setChat([...chat, { text: message, fromUser: true }]);
    setMessage('');

    // Send message to backend API
    try {
      const response = await axios.post('http://localhost:8000/chat/', { message });
      setChat([...chat, { text: message, fromUser: true }, { text: response.data.reply, fromUser: false }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chat-window">
        {chat.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.fromUser ? 'user' : 'bot'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          placeholder="Ask something..."
          className="chat-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
