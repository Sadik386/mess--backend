console.log('Starting server...');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

console.log('Dotenv config done');
console.log('PORT from env:', process.env.PORT);
console.log('MONGO_URI from env:', process.env.MONGO_URI ? 'Set' : 'Not Set');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Body:', req.body);
    next();
});

console.log('Connecting to MongoDB...');
// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mess_management')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
console.log('Loading auth routes...');
app.use('/api/auth', require('./routes/auth'));
console.log('Loading meals routes...');
app.use('/api/meals', require('./routes/meals'));
console.log('Loading expenses routes...');
app.use('/api/expenses', require('./routes/expenses'));
console.log('Loading payments routes...');
app.use('/api/payments', require('./routes/payments'));
console.log('Loading reports routes...');
app.use('/api/reports', require('./routes/reports'));
console.log('Loading users routes...');
app.use('/api/users', require('./routes/users'));
console.log('Loading settings routes...');
app.use('/api/settings', require('./routes/settings'));
console.log('Routes loaded.');

app.get('/', (req, res) => {
    res.send('Mess Management System API');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
