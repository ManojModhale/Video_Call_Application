const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/authRoutes'); // Corrected path
//const verifyRoutes = require('./routes/verificationRoutes');
//const meetingRoutes = require('./routes/meetingRoutes');


dotenv.config(); // Load environment variables from .env

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Or "*" for development, but specify in production
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 5000;
const uri = process.env.MONGO_URI; // Use MONGODB_URI from .env

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Avoid long wait times
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Routes
app.use('/auth', authRoutes);
//app.use('/verify', verifyRoutes);
//app.use('/api/meetings', meetingRoutes);


//  Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, '../front-end/build')));

//error handling middleware to catch unexpected errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


//  Catch-all route to send index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../front-end/build', 'index.html'));
});


// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on("join-call", ({ meetingId, role, username }) => {
        if (!meetingId) {
            return socket.emit("error", "Meeting ID is required");
        }
        socket.join(meetingId);
        socket.meetingId = meetingId;
        socket.username = username;
        socket.role = role;
        socket.to(meetingId).emit("participant-joined", { username, role });
        console.log(`User ${username} (${role}) joined meeting ${meetingId}`);
    });

    socket.on("leave-call", ({ meetingId }) => {
        if (meetingId) {
            socket.to(meetingId).emit("participant-left", socket.username);
            socket.leave(meetingId);
        }
    });

    socket.on("end-call", ({ meetingId }) => {
        io.in(meetingId).emit("call-ended");
        io.in(meetingId).socketsLeave(meetingId);
    });

    socket.on('disconnect', () => {
        const { meetingId, username } = socket;
        if (meetingId) {
            socket.to(meetingId).emit('participant-left', username);
            console.log(`User ${username} disconnected from meeting ${meetingId}`);
            socket.leave(meetingId);
        }
    });

    // Set of active participants to track toggles
    const activeParticipants = new Map(); // Key: meetingId, Value: { participantId: { micState, camState } }

    // Handle WebRTC signaling
    socket.on('signal', ({ meetingId, targetId, signalData }) => {
        if (!meetingId || !targetId || !signalData) {
            console.error('Invalid signaling data');
            return;
        }

        // Send signaling data to the target client
        socket.to(targetId).emit('signal', { senderId: socket.id, signalData });
    });

    socket.on("toggle-mic", ({ meetingId, participantId, state }) => {
        const meetingState = activeParticipants.get(meetingId) || {};
        const participantState = meetingState[participantId] || {};

        // Broadcast only if there's an actual state change
        if (participantState.micState !== state) {
            meetingState[participantId] = { ...participantState, micState: state };
            activeParticipants.set(meetingId, meetingState);
            socket.broadcast.to(meetingId).emit("toggle-mic", { participantId, state });
        }
    });

    socket.on("toggle-camera", ({ meetingId, participantId, state }) => {
        const meetingState = activeParticipants.get(meetingId) || {};
        const participantState = meetingState[participantId] || {};

        // Broadcast only if there's an actual state change
        if (participantState.camState !== state) {
            meetingState[participantId] = { ...participantState, camState: state };
            activeParticipants.set(meetingId, meetingState);
            socket.broadcast.to(meetingId).emit("toggle-camera", { participantId, state });
        }
    });


});



// Start the server
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
