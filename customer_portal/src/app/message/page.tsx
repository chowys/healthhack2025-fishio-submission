"use client";
import { useState } from "react";
import { FiSend } from "react-icons/fi";

export default function MessagesPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! How are you?", sender: "other" },
    { id: 2, text: "I'm good, how about you?", sender: "me" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { id: messages.length + 1, text: input, sender: "me" }]);
      setInput("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4 shadow-md hidden md:block">
        <h2 className="text-lg font-semibold mb-4">Chats</h2>
        <div className="cursor-pointer p-2 rounded-lg hover:bg-gray-200">John Doe</div>
        <div className="cursor-pointer p-2 rounded-lg hover:bg-gray-200">Jane Smith</div>
      </div>

      {/* Chat Window */}
      <div className="flex flex-col w-full md:w-3/4 bg-white shadow-lg">
        {/* Chat Header */}
        <div className="p-4 border-b font-semibold text-gray-700">John Doe</div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 max-w-xs md:max-w-sm lg:max-w-md rounded-lg shadow-md text-white ${msg.sender === "me" ? "bg-[#075540] ml-auto" : "bg-gray-400"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex items-center p-4 border-t bg-gray-100">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#075540]"
          />
          <button onClick={sendMessage} className="ml-2 p-2 bg-[#075540] text-white rounded-lg hover:bg-green-700">
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
