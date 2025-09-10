import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'; // Add this import
import cors from 'cors';
import path from 'path';

dotenv.config();

connectDB();

const app = express();

// IMPORTANT: Webhook route MUST come before express.json() middleware
// Stripe webhooks need raw body, not JSON parsed body
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// Regular middleware
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

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes); // Add this line

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});