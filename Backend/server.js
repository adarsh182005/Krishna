import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cors from 'cors';
import path from 'path'; // Import the path module

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// Get the directory name for the current module's path
const __dirname = path.resolve();

// This middleware serves static files from the 'uploads' folder
// The path '/uploads' is what your frontend will use to access the images
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});