"use client";
import { useEffect, useState, useRef } from "react";
import { Box, List, ListItem, ListItemText, Typography, Paper, TextField, Button, Avatar } from "@mui/material";

// Static client list
const clients = [
  { id: 1, name: "John Doe", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, name: "Jane Smith", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
  { id: 3, name: "Alice Johnson", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
];

// Static messages
const staticMessages = [
  { sender: "John Doe", message: "Hello! How are you?", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { sender: "You", message: "I'm doing great! How can I help you?", avatar: "https://plus.unsplash.com/premium_photo-1661898576032-fd26e3409175?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEyfHx8ZW58MHx8fHx8" },
  { sender: "John Doe", message: "I need assistance with my appointment.", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
];

const ChatPage = () => {
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [messages, setMessages] = useState(staticMessages);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when a new message is sent
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: "You", message: newMessage, avatar: "https://plus.unsplash.com/premium_photo-1661898576032-fd26e3409175?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEyfHx8ZW58MHx8fHx8" }]);
      setNewMessage("");
    }
  };

  return (
    <Box display="flex" height="90vh">
      {/* Sidebar with client list */}
      <Paper sx={{ width: 250, p: 2, overflowY: "auto" }}>
        <Typography variant="h6" gutterBottom>
          Clients
        </Typography>
        <List>
          {clients.map((client) => (
            <ListItem
              button
              key={client.id}
              onClick={() => setSelectedClient(client)}
              selected={selectedClient.id === client.id}
              sx={{ bgcolor: selectedClient.id === client.id ? "#cfe8fc" : "transparent" }}
            >
              <Avatar src={client.avatar} sx={{ mr: 1 }} />
              <ListItemText primary={client.name} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Chat Window */}
      <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
        <Typography variant="h5" p={2} sx={{ borderBottom: "1px solid #ddd" }}>
          Chat with {selectedClient.name}
        </Typography>

        {/* Chat Messages */}
        <Box flex={1} p={2} sx={{ overflowY: "auto", maxHeight: "calc(100vh - 120px)" }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                flexDirection: msg.sender === "You" ? "row-reverse" : "row",
              }}
            >
              <Avatar src={msg.avatar} sx={{ width: 32, height: 32, mx: 1 }} />
              <Box sx={{ textAlign: msg.sender === "You" ? "right" : "left" }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {msg.sender}
                </Typography>
                <Paper
                  sx={{
                    display: "inline-block",
                    p: 1.5,
                    bgcolor: msg.sender === "You" ? "#cfe8fc" : "#e0e0e0",
                    borderRadius: "10px",
                  }}
                >
                  {msg.message}
                </Paper>
              </Box>
            </Box>
          ))}
          <div ref={chatEndRef} /> {/* Auto-scroll reference */}
        </Box>

        {/* Fixed Chat Bar at the Bottom */}
        <Paper sx={{ p: 2, display: "flex", alignItems: "center", borderTop: "1px solid #ddd" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()} // Allow sending with Enter key
          />
          <Button variant="contained" color="primary" onClick={sendMessage} sx={{ ml: 1 }}>
            Send
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatPage;
