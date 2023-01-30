import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  title: String,
  description: String,
  name: String,
  creator: String,
  tags: [String],
  imageFile: String,
  // likeCount: {
  //   type: Number,
  //   default: 0,
  // },
  likes: {
    // we will store the id of the user who liked the post
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;