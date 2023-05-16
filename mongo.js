const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

// Connection URL and database name
const mongoUrl = "mongodb+srv://lakna:lakna@bodyfitnessbuilder.s4l6lye.mongodb.net/";

// Connect to MongoDB Atlas
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "fitnessbuilder" // Specify the name of the database
}).then(() => {
  console.log("Connected to MongoDB Atlas");


  // Define the schema for BMI data
  const bmiSchema = new mongoose.Schema(
    {
      age: Number,
      gender: String,
      height: Number,
      weight: Number,
      bmi: Number,
      goal: String
    },
    { collection: 'bmiData' } // Specify the collection name
  );

  // Create the BMI model
  const BmiData = mongoose.model('BmiData', bmiSchema);

  // Define the route for saving BMI data
  app.post('/api/save-bmi', async (req, res) => {
    const { age,gender,height, weight, bmi,goal } = req.body;

    try {
      // Create a new instance of the BmiData model
      const bmiData = new BmiData({ age,gender,height, weight, bmi,goal});

      // Save the BMI data to the database
      const savedData = await bmiData.save();

      console.log('BMI data saved:', savedData._id);
      res.json({ message: 'BMI data saved' });
    } catch (err) {
      console.error('Failed to save BMI data:', err);
      res.status(500).json({ error: 'Failed to save BMI data' });
    }
  });
  
  // Define the schema for the exercises
  const exerciseSchema = new mongoose.Schema({
    name: String,
    category: String,
    description: String,
    duration: Number,
    caloriesBurned: Number,
    difficulty: String,
    equipment: String,
    muscleGroups: [String],
    videoUrl: String
  });
  
  // Create the Exercise model
  const Exercise = mongoose.model('Exercise', exerciseSchema);
  
  // Define the route for retrieving exercises based on specific fields
  app.get('/api/exercises', async (req, res) => {
    const { name, category, difficulty } = req.query;
  
    // Build the query object based on the provided fields
    const query = {};
  
    if (name) {
      query.name = name;
    }
  
    if (category) {
      query.category = category;
    }
  
    if (difficulty) {
      query.difficulty = difficulty;
    }
  
    try {
      // Find exercises based on the query
      const exercises = await Exercise.find(query).exec();
      res.json(exercises);
    } catch (err) {
      console.error('Failed to retrieve exercises:', err);
      res.status(500).json({ error: 'Failed to retrieve exercises' });
    }
  });
  
  // Start the server
  const port = 8088; // Replace with your desired port number
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

}).catch((err) => {
  console.error("Failed to connect to MongoDB Atlas:", err);
});
