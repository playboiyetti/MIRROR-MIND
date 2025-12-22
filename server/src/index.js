const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initializeFirebase } = require('./config/firebase');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase
initializeFirebase();

// Basic Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Mirror Mind Backend API',
        status: 'Running',
        version: '1.0.0'
    });
});

app.use('/api', require('./routes/api'));

// Health check route
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
