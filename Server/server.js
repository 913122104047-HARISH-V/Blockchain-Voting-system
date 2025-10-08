const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config({path: path.join(__dirname, 'config', 'config.env')});
connectDB();

const app = express();
app.use(cors({origin: process.env.ORIGIN, credentials: true}));
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
