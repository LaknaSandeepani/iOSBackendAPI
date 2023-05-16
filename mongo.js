const express = require("express");
const mongoose = require("mongoose");

// Connection URL and database name
const mongoUrl = "mongodb+srv://lakna:lakna@bodyfitnessbuilder.s4l6lye.mongodb.net/";

// Connect to MongoDB Atlas
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "fitnessbuilder" // Specify the name of the database
}).then(() => {
  console.log("Connected to MongoDB Atlas");

//    // Define a data schema and model
//    const userSchema = new mongoose.Schema({
//     name: String,
//     age: Number,
//     email: String
//   });
  
//   const User = mongoose.model("User", userSchema);
  
//   // Create a new user document
//   const user = new User({
//     name: "John Doe",
//     age: 25,
//     email: "johndoe@example.com"
//   });
  
//   // Save the user to the database
//   user.save().then(() => {
//     console.log("User created and saved to the database");
//   }).catch((err) => {
//     console.error("Failed to save user:", err);
//   });
// }).catch((err) => {
//   console.error("Failed to connect to MongoDB Atlas:", err);
});
