require('dotenv').config();
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, 'images'));
    },
    filename: function(req, file, cb) {
        // Create unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function(req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

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
    console.log('Authentication middleware triggered');
    console.log('Headers:', JSON.stringify(req.headers));
    
    const authHeader = req.headers['authorization'];
    console.log('Auth header:', authHeader);
    
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token extracted:', token ? 'Token present' : 'No token');
    
    if (!token) {
        console.log('Authentication failed: No token provided');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Authentication failed: Invalid token', err.message);
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        console.log('Authentication successful for user:', user.email);
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

// Image upload endpoint
app.post('/upload-image', (req, res, next) => {
    console.log('Upload endpoint hit');
    console.log('Request headers:', JSON.stringify(req.headers));
    next();
}, upload.single('image'), (req, res, next) => {
    console.log('Multer middleware processed');
    console.log('File received:', req.file ? 'Yes' : 'No');
    if (req.file) {
        console.log('File details:', {
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
    }
    next();
}, authenticateToken, (req, res) => {
    console.log('Processing upload after authentication');
    try {
        // Verify user is admin
        if (req.user.role !== 'admin') {
            console.log('Upload rejected: User is not admin');
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }
        
        if (!req.file) {
            console.log('Upload rejected: No file in request');
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        // Return the path to the uploaded file (relative to the server root)
        const imagePath = '/images/' + req.file.filename;
        console.log('Upload successful, returning path:', imagePath);
        res.json({ 
            message: 'Image uploaded successfully',
            imagePath: imagePath
        });
    } catch (error) {
        console.error('Error in upload handler:', error);
        res.status(500).json({ message: 'Error uploading image' });
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
        const token = jwt.sign({ email: adminEmail, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
