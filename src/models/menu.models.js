import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  mainPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  discountedPrice: {
    type: Number,
    min: 0,
  },
  offer: {
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    amount: { type: Number, min: 0 },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  ingredients: [
    {
      type: String,
    },
  ],
  availability: {
    type: Boolean,
    default: true,
  },
  customizable: {
    type: Boolean,
    default: false,
  },
  options: [
    {
      name: { type: String, required: true },
      choices: [{ type: String }],
      required: { type: Boolean, default: false },
    },
  ],
  images: [
    {
      url: {
        type: String,
      },
      publicKey: {
        type: String,
      },
    },
  ],
  veg: {
    type: Boolean,
    default: true,
  },
  allergens: [
    {
      type: String,
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },

  popular: {
    type: Boolean,
    default: false,
  },
});

const Menu = mongoose.model("Menu", menuSchema);
export default Menu;
