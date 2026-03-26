const mongoose = require('mongoose');
const creationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['drawing', 'journal'] },  // chaos wall or writing
  data: String,  // JSON for canvas state or text
  imageUrl: String,  // uploaded art
  title: String,
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Creation', creationSchema);