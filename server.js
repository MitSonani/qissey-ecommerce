import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import jwt from 'jsonwebtoken';
import productRoutes from './routes/productRoutes.js';
import heroRoutes from './routes/heroRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import shiprocketRoutes from './routes/shiprocketRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import seoMiddleware from './middleware/seoMiddleware.js';
import { getSitemap } from './controllers/productController.js';

const otpStore = new Map();

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' }); // Fallback

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Canonical Redirect: www.qissey.com → qissey.com (always HTTPS)
app.use((req, res, next) => {
    const host = req.headers.host;
    if (host && host.startsWith('www.')) {
        const newHost = host.slice(4);
        return res.redirect(301, `https://${newHost}${req.originalUrl}`);
    }
    next();
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shiprocket', shiprocketRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/contact', contactRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


// Serve frontend static files
app.get('/sitemap.xml', getSitemap);
app.use(seoMiddleware);
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for single-page app routing
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, (err) => {
    if (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
    console.log(`Server is running on port ${PORT}`);
});


