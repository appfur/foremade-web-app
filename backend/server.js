const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
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
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
    cb(null, true);
  },
});

// API Endpoints
app.post('/upload', upload.single('image'), async (req, res) => {
  console.log('Received request to /upload');
  try {
    if (!req.file) {
      console.error('No image file provided');
      return res.status(400).json({ error: 'Image file is required' });
    }

    console.log('Uploading image:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

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

// Health check
app.get('/health', (req, res) => {
  console.log('Received request to /health');
  res.status(200).json({ status: 'Server running' });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));