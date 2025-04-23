// server/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Default React dev server port
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI || 'mongodb://localhost:27017/videocall'; // Adjust if using local MongoDB

app.use(cors());
app.use(express.json());

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB database connection established successfully'))
    .catch(err => console.log(err));

// Socket.IO logic will go here later
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.get('/', (req, res) => {
    res.send('MERN Video Call Backend is running!');
});

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});