"use client";

import axios from "axios";
import { log } from "console";
import React, { useEffect, useState } from "react";
import { set } from "zod";

const DisplayMessage = () => {
  const [messages, setMessages] = useState([]);

  const getMessages = async () => {
    try {
      const data = await axios.get("/api/get-messages");
      setMessages(data.data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMessages();
  }, [setMessages]);

  return (
    <div>
      <button onClick={() => getMessages()}>refresh</button>

      {messages.map((msg: any, index) => (
        <div key={index}>{msg.content}</div>
      ))}
    </div>
  );
};

export default DisplayMessage;
