const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Task = require('./models/Task');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// This connection is for production/development. Test environment will use in-memory server.
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));
}

// Routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);


const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; 