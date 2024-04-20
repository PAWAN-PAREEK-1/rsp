import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  popular: {
    type: Boolean,
    default: false,
  },

  isDeleted: {
     type: Boolean,
    default: false,
  }
}, {
    timestamps: true
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
