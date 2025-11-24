import express from "express";
import dashboardRouter from "./routes/dashboard";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/dashboard", dashboardRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on port ${port}`);
});