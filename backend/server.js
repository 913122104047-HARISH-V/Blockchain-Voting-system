import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import logger from "./utils/logger.js";

dotenv.config();

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Backend server started on port ${PORT}`);
    });
  } catch (err) {
    logger.error("Failed to start server", err);
    process.exit(1);
  }
}

startServer();
