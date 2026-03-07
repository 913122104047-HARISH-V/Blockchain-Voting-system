require("dotenv").config();

const app = require("./app");
const { connectDB } = require("./config/db");
const logger = require("./utils/logger");

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
