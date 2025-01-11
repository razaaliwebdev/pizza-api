import express from "express";
import 'dotenv/config';
import path, { join } from 'path';
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
import connectDB from "./db/db.js";

import routes from './routes/index.route.js';
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// Middleware
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/api",routes);


// Serve uploaded files (if needed)
app.use('/uploads', express.static(join(__dirname, 'uploads')));



// Error Handler
app.use(errorHandler)


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on the port:${PORT}`);
});