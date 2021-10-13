import mongoose from 'mongoose';
const { Schema } = mongoose;

const nftSchema = new Schema({
  _id: Number,
  name: String,
  attributes: [{ _id: false, trait_type: String, value: String }],
  date: { type: Date, default: Date.now },
  image: String,
  phaseID: Number,
  imageID: Number,
  maxPrice: String,
  style: String
});

export let nftImage
if (process.env.NODE_ENV === 'production') {
  nftImage = mongoose.model('tokens', nftSchema, 'tokens')
}
else {
  nftImage = mongoose.model('testnet', nftSchema, 'testnet')
}
