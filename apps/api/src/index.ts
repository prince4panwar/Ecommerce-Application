import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { logger, stream } from "./lib/logger";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(helmet());
app.use(morgan("combined", { stream })); // Use Winston stream for Morgan
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
      logger.info("Health check endpoint called");
      res.json({ message: "E-Commerce API is running" });
});

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import analyticsRoutes from "./routes/analytics.routes";
import categoryRoutes from "./routes/category.routes";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/categories", categoryRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
