require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect Database
connectDB();

// Health check and Keep-Alive ping endpoints for Render/Cron pings
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.get('/api/ping', (req, res) => {
  res.send('pong');
});

// Routes
app.use('/api/services', require('./routes/servicesRoutes'));
app.use('/api/guides', require('./routes/guidesRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/data', require('./routes/crudRoutes'));
app.use('/api/incidents', require('./routes/incidentRoutes'));

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Emergency Assistance Platform API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
