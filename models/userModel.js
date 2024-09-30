const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
    },
    role: { 
      type: String, 
      enum: ['stakeholder', 'public'], 
      required: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", schema);

module.exports = User;
