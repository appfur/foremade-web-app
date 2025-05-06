const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// Cloudinary Config
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary configured successfully');
} catch (err) {
  console.error('Cloudinary config error:', err.message);
}

// Middleware
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// Serve Vite static files
app.use(express.static(path.join(__dirname, '..', 'dist')));

// API Endpoints
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      console.error('No image file provided');
      return res.status(400).json({ error: 'Image file is required' });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', {
            message: error.message,
            name: error.name,
            http_code: error.http_code,
          });
          reject(error);
        }
        resolve(result);
      }).end(req.file.buffer);
    });

    console.log('Image uploaded to Cloudinary:', result.secure_url);
    res.status(200).json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error('Upload error:', {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: 'Failed to upload image', details: err.message });
  }
});

// Handle all other routes with Vite's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));