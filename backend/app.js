import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import electionRoutes from "./routes/electionRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import voterRoutes from "./routes/voterRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/voter", voterRoutes);
app.use("/api/vote", voteRoutes);
app.use("/api/results", resultRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
