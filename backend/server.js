const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const User = require('./models/User');
const Creation = require('./models/Creation');
dotenv.config();

cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });
const app = express();
app.use(cors({ origin: 'https://anushkaragarwal.github.io' }));  // Your frontend
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).then(() => console.log('DB ready'));

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ msg: 'Invalid token' }); }
};

// Multer for uploads
const upload = multer({ dest: 'uploads/' });

// Register
app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed, email });
  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user._id, username } });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(400).json({ msg: 'Invalid creds' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user._id, username } });
});

// Save Creation
app.post('/api/creations', auth, upload.single('image'), async (req, res) => {
  let imageUrl = '';
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    imageUrl = result.secure_url;
  }
  const creation = new Creation({
    ...req.body,
    userId: req.user.id,
    imageUrl
  });
  await creation.save();
  res.json(creation);
});

// Get Public Gallery
app.get('/api/creations/public', async (req, res) => {
  const creations = await Creation.find({ isPublic: true }).populate('userId', 'username').sort({ createdAt: -1 }).limit(20);
  res.json(creations);
});

// Get User Creations
app.get('/api/creations/user/:id', auth, async (req, res) => {
  const creations = await Creation.find({ userId: req.params.id, isPublic: true });
  res.json(creations);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend on ${PORT}`));