const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
var crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide a valid email"],
    validator: [validator.isEmail, "Please enter email in correct format"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "password length must be at least 6 characters"],
    select: false, // optional
  },
  role: {
    type: String,
    default: "user",
  },
  photo: {
    id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,

    },
  },
  forgot_password_token: String,
  forgot_password_expires_at: Date,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

//encrypt password before saving -HOOKS
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//vaidate password with passed on user password
userSchema.methods.isPasswordValid = async function (passwordFromUser) {
  if (!passwordFromUser) {
    return false;
  }
  return await bcrypt.compare(passwordFromUser, this.password);
};

//create and return jwttoken

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

//generate forgot password token

userSchema.methods.generateForgotPasswordToken = function () {
    
  //generate long password token
  const forgotToken = crypto.randomBytes(20).toString("hex");

  // getting a hash - make sure to get a hash on backend
  this.forgot_password_token = crypto.createHash("sha256").update(forgotToken).digest("hex");

  //timeof token
  this.forgot_password_expires_at = Date.now() + process.env.FORGOT_PASSWORD_EXPIRY;
  return forgotToken;
};

module.exports = mongoose.model("User", userSchema);
