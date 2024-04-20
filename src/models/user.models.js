import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      uniqe: true,
    },

    phone: {
      type: String,
      required: true,
      uniqe: true,
    },

    profile: {
      url: {
        type: String,
      },
      publicKey: {
        type: String,
      },
    },

    password: {
      type: String,
      required: true,
    },

    address: {
      type: String,
    },

    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      enum: ["Admin", "Waiter", "Chef", "User"],
      default: "User",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
