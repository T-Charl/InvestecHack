// src/Chatbot.js
import React, { useState } from 'react';
import axios from 'axios';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');

      console.log('Sending input:', input); // Log input

      try {
        const response = await axios.post('http://localhost:5000/chatbot', {
          message: input,
        });
        console.log('Response:', response); // Log the response
        setMessages((prev) => [
          ...prev,
          { text: response.data.message, sender: 'bot' },
        ]);
      } catch (error: any) {
        console.error('Error fetching bot response:', error.response ? error.response.data : error.message);
        setMessages((prev) => [
          ...prev,
          { text: 'Error getting response from the bot', sender: 'bot' },
        ]);
      }
    }
  };




  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="flex-grow overflow-y-auto p-4 bg-white shadow-lg rounded-lg">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'bot' ? 'text-left' : 'text-right'}`}>
            <div className={`inline-block p-2 rounded-lg ${msg.sender === 'bot' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="ml-2 p-2 text-white bg-blue-500 rounded-lg">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
