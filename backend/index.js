const app = require('./server');
const connectDB = require('./config/db');
require('dotenv').config();

connectDB();

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = server; 