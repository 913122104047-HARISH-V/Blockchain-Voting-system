const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/blockchain_voting";
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });
}

module.exports = {
  mongoose,
  connectDB,
};
