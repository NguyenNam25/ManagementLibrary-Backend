const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// Library Card Schema
const LibraryCardSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: [true, "Card number is required"],
    trim: true,
    // unique: true,
    match: [/^[A-Z0-9]{8,12}$/, "Invalid card number format"]
  },
  registrationDate: {
    type: Date,
    required: [true, "Registration date is required"],
    default: Date.now
  },
  expirationDate: {
    type: Date,
    required: [true, "Expiration date is required"],
    validate: {
      validator: function(value) {
        return value > this.registrationDate;
      },
      message: "Expiration date must be after registration date"
    }
  },
  // status: {
  //   type: String,
  //   enum: ["active", "expired", "lost", "cancelled"],
  //   default: "active"
  // }
});

// Base User Schema
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
    minlength: [2, "Full name must be at least 2 characters long"],
  },
  image: {
    type: String,
    default: "default-avatar.png",
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of birth is required"],
    validate: {
      validator: function(value) {
        const age = new Date().getFullYear() - value.getFullYear();
        return age >= 13; // Minimum age requirement
      },
      message: "User must be at least 13 years old"
    }
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: {
      values: ["male", "female", "other"],
      message: "Gender must be either male, female, or other"
    },
  },
  citizenId: {
    type: String,
    required: [true, "Citizen ID is required"],
    match: [/^[0-9]{9,12}$/, "Invalid citizen ID format"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    trim: true,
    match: [/^[0-9]{10,15}$/, "Please enter a valid phone number"]
  },
  address:{
    type: String,
    required: [true, "Address is required"],
    trim: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: [true, "Role is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  //Reader
  occupation: {
    type: String,
    trim: true
  },
  libraryCard: {
    type: LibraryCardSchema,
  },
  interestedBook: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book"
  }],
  status: {
    type: String,
    enum: ["active", "blocked", "unverified"],
    default: "unverified"
  },
  //Admin
  abouts: [{
    type: {
      type: String,
      enum: ["day", "info", "image"],
      trim: true,
      required: [true, "About type is required"],
    },
    name: {
      type: String,
      required: [true, "About name is required"],
      trim: true
    },
    detail: {
      type: String,
      required: [true, "About detail is required"],
      trim: true
    }
  }],
  services: [{
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true
    },
    detail: {
      type: String,
      required: [true, "Service detail is required"],
      trim: true
    }
  }],
  rules: [{
    name: {
      type: String,
      required: [true, "Rule name is required"],
      trim: true
    },
    detail: {
      type: String,
      required: [true, "Rule detail is required"],
      trim: true
    }
  }],
  //Manager, Mod and Admin
  staffId: {
    type: String,
  },
  
}, {
  timestamps: true,
  // discriminatorKey: "userType"
});

//static method
UserSchema.statics.login  = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw new Error("incorrect password");
  }
  throw new Error("incorrect email");
}

// Create the base User model
const User = mongoose.model("User", UserSchema);
const LibraryCard = mongoose.model("LibraryCard", LibraryCardSchema);
// Create discriminator models

module.exports = { User, LibraryCard };
