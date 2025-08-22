require('dotenv').config();
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // for parsing application/json
app.use(express.static(__dirname)); // Serve static files from the root directory

// HTML Page Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/music', (req, res) => {
    res.sendFile(path.join(__dirname, 'fundamentals.html'));
});

app.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, 'shop.html'));
});

app.get('/course', (req, res) => {
    res.sendFile(path.join(__dirname, 'course.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// API Routes for Authentication

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token.' });
        req.user = user;
        next();
    });
};

// Product management routes
app.get('/api/products', (req, res) => {
    try {
        const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'shop-data.json'), 'utf8'));
        res.json(products);
    } catch (error) {
        console.error('Error reading products:', error);
        res.status(500).json({ message: 'Error reading products' });
    }
});

app.post('/update-products', authenticateToken, (req, res) => {
    try {
        // Verify user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }
        
        const products = req.body;
        fs.writeFileSync(path.join(__dirname, 'shop-data.json'), JSON.stringify(products, null, 2));
        res.json({ message: 'Products updated successfully' });
    } catch (error) {
        console.error('Error updating products:', error);
        res.status(500).json({ message: 'Error updating products' });
    }
});

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
        const token = jwt.sign({ email: adminEmail, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials.' });
    }
});

// Fallback 404 for other routes
app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
