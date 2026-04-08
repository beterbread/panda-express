import React, { useState, useRef, useEffect } from "react";
import "./styles/Chat.css";
import axios from "axios";
import { Translate } from "../Translation/TranslationWrapper";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);

  // Function to handle user input and get AI response
  const handleSendMessage = async () => {
    if (userInput.trim() === "") return; // Don't send empty messages

    // Add user message first
    const newMessages = [{ text: userInput, sender: "user" }];

    // Call backend server for response
    const aiResponse = await generateAIResponse(userInput);

    // Add AI response to the messages array
    newMessages.push({ text: aiResponse, sender: "ai" });

    // Update the state with both messages (user and AI) together
    setMessages((prevMessages) => [...prevMessages, ...newMessages]);

    // Clear the input field
    setUserInput("");
  };

  // Fetch AI response from backend
  const generateAIResponse = async (userMessage) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        { userMessage }
      );
      return response.data.message;
    } catch (error) {
      console.error("Error fetching response from backend:", error);
      return "I'm sorry, there was an error processing your request.";
    }
  };

  // Scroll to the bottom of the messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container" aria-live="polite">
      <div className="messages-container" role="log" aria-live="polite">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === "user" ? "user" : "ai"}`}
            aria-label={`${message.sender === "user" ? "User" : "AI"}: ${message.text}`}
            tabIndex="0"
          >
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message"
          className="input-field"
          aria-label="Enter your message"
          tabIndex="0"
        />
        <button
          onClick={handleSendMessage}
          className="send-button"
          aria-label="Send message"
          tabIndex="0"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        >
          <Translate>Send</Translate>
        </button>
      </div>
    </div>
  );
};

export default Chat;
