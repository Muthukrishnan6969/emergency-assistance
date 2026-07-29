require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/api/services', require('./routes/servicesRoutes'));
app.use('/api/guides', require('./routes/guidesRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/data', require('./routes/crudRoutes'));

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Emergency Assistance Platform API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
