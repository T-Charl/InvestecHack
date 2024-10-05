import React, { useEffect, useState } from 'react';
import { createStore } from 'botframework-webchat';  // Only import createStore
import { DirectLine } from 'botframework-directlinejs';
import ReactWebChat from 'botframework-webchat';
import axios from 'axios';

const Chatbot = () => {
  const [directLine, setDirectLine] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        // Make a request to your backend to get the Direct Line token
        const response = await axios.get('http://localhost:5000/get_direct_line_token'); // Update the URL as needed
        const token = response.data.token;

        // Create Direct Line instance with the token
        const directLineInstance : DirectLine = new DirectLine({ token });
        setDirectLine(directLineInstance);
      } catch (error) {
        console.error("Error fetching the Direct Line token:", error);
      }
    };

    fetchToken();
  }, []);

  return (
    <div style={{ height: '400px', width: '300px', border: '1px solid black' }}>
      {directLine && (
        <ReactWebChat 
          directLine={directLine} 
          userID="user1" 
          botID="bot1" 
          store={createStore({})} // Pass store directly here
        />
      )}
    </div>
  );
};

export default Chatbot;
