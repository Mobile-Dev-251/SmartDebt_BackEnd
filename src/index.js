import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import debtRoutes from "./routes/debtsRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import contactRoutes from "./routes/contactsRoutes.js";
import categoryRoutes from "./routes/categoriesRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import sql from "./config/db.js";
import initReminderWorker from "./workers/reminderWorker.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// --- Cấu hình Swagger ---
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API Documentation for SmartDebt Application",
    },
    servers: [
      //{
      //  url: "https://app-nodejs-smartdebt-backend-f5a5f6d5fteddea8.eastasia-01.azurewebsites.net", // URL thực tế trên Azure
      //  description: "Production server",
      //},
      {
        url: `http://localhost:${port}`,
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// -----------------------

app.use(express.json());
app.use(
  cors({
    origin: "*", //
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/debts", debtRoutes);
app.use("/expenses", expenseRoutes);
app.use("/contacts", contactRoutes);
app.use("/groups", groupRoutes);
app.use("/categories", categoryRoutes);
initReminderWorker(sql);
app.listen(port, '0.0.0.0', () => {
  console.log("Server is running on http://localhost:" + port);
});

