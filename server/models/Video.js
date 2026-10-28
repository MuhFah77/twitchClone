import mongoose from 'mongoose';

export default mongoose.model('Video', new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Untitled' },
  filename: { type: String, required: true },
}, { timestamps: true }));