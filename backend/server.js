require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(morgan('combined'));

// Operational Routing Base Matrix
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Catch-all system handling routing anomalies
app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint layout location trace target invalid.' });
});

app.use((err, req, res, next) => {
    console.error('System Exception Trace Element:', err.stack);
    res.status(500).json({ message: 'Fatal core runtime runtime disruption exception.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`TaskSphere Core Engine initialized on port cluster channel: ${PORT}`);
});