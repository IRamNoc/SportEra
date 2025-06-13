import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import pingRoute from './routes/ping';
import authRoute from './routes/auth';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use('/api/ping', pingRoute);
app.use('/api/auth', authRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
