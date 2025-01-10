import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';  

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));  // Allow requests from any origin (for testing)
app.use(express.json());  // Parse incoming JSON requests

// Home route to check if the server is running
app.get("/", (req, res) => {
  res.send("Welcome to the Chatbot API");
});

// API endpoint to handle the chatbot request
app.post("/api/chat", async (req, res) => {
  try {
    console.log("Request body:", req.body);  // Log the incoming request body for debugging
    
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      req.body,
      {
        params: { key: process.env.API_KEY },
        headers: { "Content-Type": "application/json" },
      }
    );
    
    console.log("API response:", response.data);  // Log the full API response for debugging
    
    res.json(response.data);  // Send the data back as a JSON response
  } catch (error) {
    console.error("Error occurred:", error);  // Log error for better debugging
    
    // Check if the error has a response from the API
    if (error.response) {
      console.error("Error Response Data:", error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: error.message });  // Send error response if there's an issue
    }
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
