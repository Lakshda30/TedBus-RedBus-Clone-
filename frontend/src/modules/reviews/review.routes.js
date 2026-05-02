import express from "express";
import {
  createReview,
  editReview,
  reportReview,
  getRouteReviews
} from "./review.controller.js";

import auth from "../../middlewares/auth.middleware.js";
import verified from "../../middlewares/verified.middleware.js";

const router = express.Router();

// ✅ CREATE REVIEW
router.post("/", auth, verified, createReview);

// EDIT REVIEW
router.patch("/:id", auth, editReview);

// REPORT REVIEW
router.post("/:id/report", auth, reportReview);

// GET REVIEWS OF A ROUTE
router.get("/route/:routeId", getRouteReviews);

export default router;
