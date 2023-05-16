import express from "express";
import cors from "cors";
import configRoutes from './routes/index.mjs';

// Load environment variables into process.env
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

// Configure all server routes
configRoutes(app);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});