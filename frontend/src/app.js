import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
import reviewRoutes from "./modules/reviews/review.routes.js";

app.use("/api/reviews", reviewRoutes);

export default app;
