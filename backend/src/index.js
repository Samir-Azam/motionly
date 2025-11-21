import 'dotenv/config';
import { app } from './app.js';
import { connectDB } from './config/db.js';
import logger from './config/logger.js';

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    logger.info('Database connection established!');

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server: ' + error.message);
    process.exit(1);
  }
};

startServer();
