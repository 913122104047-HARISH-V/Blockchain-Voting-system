// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const connectDB = require("./config/db");

dotenv.config({path: path.join(__dirname, 'config', 'config.env')});
connectDB();

const app = express();
app.use(cors({origin: process.env.ORIGIN, credentials: true}));
app.use(express.json());

// Import Routes
const authRoutes = require("./routes/authRoutes");
const electionRoutes = require("./routes/electionRoutes.js");
const candidateRoutes = require("./routes/candidateRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const transactionRoutes = require("./routes/transactionRoutes.js");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => {
  res.send("Blockchain Voting System API is running...");
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



