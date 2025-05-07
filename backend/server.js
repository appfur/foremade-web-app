const express = require('express');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const {
      sellerName,
      name,
      description,
      price,
      stock,
      category,
      colors,
      sizes,
      condition,
      productUrl,
      sellerId,
    } = req.body;

    let imageUrl = '';
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const productData = {
      sellerName,
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      colors: JSON.parse(colors),
      sizes: JSON.parse(sizes),
      condition,
      productUrl: productUrl || '',
      sellerId,
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'products'), productData);
    res.json({ message: 'Product uploaded successfully', id: docRef.id });
  } catch (error) {
    console.error('Error uploading product:', error);
    res.status(500).json({ error: 'Failed to upload product' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});