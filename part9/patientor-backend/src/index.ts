import express from "express";
import diagnosesRouter from "./routes/diagnoses";
const app = express();
app.use(express.json());

// allow requests from all origins (can be more specific in production)
import cors from "cors";
app.use(cors());

const PORT = 3001;

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api/diagnoses", diagnosesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
