import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import userRoutes from "./src/routes/user.routes.js";
import menuRoutes from "./src/routes/menu.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import connectDB from "./src/db/db.config.js";
import cors from 'cors'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
export const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

app.use("/api/user", userRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/order", orderRoutes);
app.use("/", (req, res) => res.send('Hello World'));

connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
