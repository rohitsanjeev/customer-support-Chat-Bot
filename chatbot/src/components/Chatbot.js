import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import './Chatbot.css';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatWindowRef = useRef(null);
  const { isDarkMode, toggleTheme } = useTheme();

  // Add welcome message when component mounts
  useEffect(() => {
    setChat([{
      text: "Hello! I'm your customer support assistant. How can I help you today?",
      fromUser: false,
      timestamp: new Date()
    }]);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chat]);

  const handleMessageChange = (e) => setMessage(e.target.value);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      text: message,
      fromUser: true,
      timestamp: new Date()
    };

    setChat(prevChat => [...prevChat, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await axios.post('http://localhost:8000/api/chat/', { message });
      const botMessage = {
        text: response.data.reply,
        fromUser: false,
        timestamp: new Date()
      };
      setChat(prevChat => [...prevChat, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChat(prevChat => [...prevChat, {
        text: "Sorry, I'm having trouble connecting. Please try again.",
        fromUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-header-avatar">
            <img src="/bot-avatar.svg" alt="Bot Avatar" />
          </div>
          <div className="chat-header-info">
            <h2>AIssist</h2>
            <span className="status">Online</span>
          </div>
        </div>
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>

      <div className="chat-window" ref={chatWindowRef}>
        {chat.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.fromUser ? 'user' : 'bot'}`}>
            <div className="message-content">
              {msg.text}
            </div>
            <div className="message-timestamp">
              {formatTime(msg.timestamp)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-message bot">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          placeholder="Type your message here..."
          className="chat-input"
        />
        <button type="submit" className="send-button">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
