require('dotenv').config();
require('./config/env');
const express = require('express');
const routes = require('./routes');
const app = express();
const auditLogger = require('./middlewares/auditLogger');
const ensureDatabaseAndAdmin = require('./config/initDb');
const mainRouter = require('./routes/index');

// Ensure DB and admin user before starting the rest of the app
ensureDatabaseAndAdmin()
  .then(() => {
    console.log('✅ Database and admin user ensured.');
  })
  .catch((err) => {
    console.error('❌ Failed to ensure database/admin:', err);
    process.exit(1);
  });

// Initialize audit worker
require('./jobs/auditWorker');

// Log every route
app.get('/ping', (req, res) => res.send('pong'));

app.use(express.json());
app.use(auditLogger); // Apply audit logging before routes
app.use('/api', routes);
//p.use('/api', mainRouter);

module.exports = app;