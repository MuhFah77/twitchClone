import mongoose from 'mongoose';

export default mongoose.model('User', new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  title: { type: String, default: '' },
  ingressId: String,
  ingressUrl: String,
  streamKey: String,
}));
