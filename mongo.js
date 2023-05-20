const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
const JWT_SECRET = "argsbdthbsw236w7r8g@1e*hfvh";
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
    videoUrl: String,
    repcount: Number,
    image: String
   
  });
  
  // Create the Exercise model
  const Exercise = mongoose.model('Exercise', exerciseSchema);
  
  // Define the route for retrieving exercises based on specific fields
  app.get('/api/exercises', async (req, res) => {
    const { name, category, image } = req.query;
  
    // Build the query object based on the provided fields
    const query = {};
  
    if (name) {
      query.name = name;
    }
  
    if (category) {
      query.category = category;
    }
  
    if (image) {
      query.image = image;
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
 
// Define the route for fetching exercise details by ID
app.get('/api/exercises/:id', async (req, res) => {
    const exerciseId = req.params.id;
    
    try {
      // Find the exercise by ID
      const exercise = await Exercise.findById(exerciseId).exec();
  
      if (exercise) {
        res.json(exercise);
      } else {
        res.status(404).json({ message: 'Exercise not found' });
      }
    } catch (err) {
      console.error('Failed to retrieve exercise:', err);
      res.status(500).json({ error: 'Failed to retrieve exercise' });
    }
  });
  
  const UserDetailsSchema = new mongoose.Schema({
    name: String,
    email: String, 
    password: String,
}, {
    collection: "UserInfo",
});

const User = mongoose.model("UserInfo", UserDetailsSchema);

// Register API
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.send({ status: "User Exists" });
        }
        
        const newUser = new User({ name, email, password });
        await newUser.save();
        
        res.send({ status: "ok" });
    } catch (error) {
        console.error(error);
        res.send({ status: "error" });
    }
});
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.send({ status: "User not found" });
        }
        
        if (user.password !== password) {
            return res.send({ status: "Invalid password" });
        }
        
        res.send({ status: "Logged in successfully" });
    } catch (error) {
        console.error(error);
        res.send({ status: "error" });
    }
});

// Define the WorkoutSchedule schema
const workoutScheduleSchema = new mongoose.Schema({
  days: [String],
  times: [String],
  exercises: [String],
  repeatSchedule: [String],
});

const WorkoutSchedule = mongoose.model('WorkoutSchedule', workoutScheduleSchema);

// Create a new workout schedule
app.post('/api/workoutschedule', (req, res) => {
  const { days, times, exercises, repeatSchedule } = req.body;

  const workoutSchedule = new WorkoutSchedule({
    days,
    times,
    exercises,
    repeatSchedule,
  });

  workoutSchedule.save()
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error saving workout schedule:', error);
      res.sendStatus(500);
    });
});

app.get('/viewschedule', (req, res) => {
    WorkoutSchedule.find()
      .then((schedules) => {
        res.json(schedules);
      })
      .catch((error) => {
        console.error('Error fetching workout schedules:', error);
        res.sendStatus(500);
      });
  });
  
app.delete("/deleteschedule", async (req, res) => {
    const { scheduleid } = req.body;
    try {
      await WorkoutSchedule.deleteOne({ _id: scheduleid });
      res.status(200).send({
        status: "ok",
        data: "Deleted",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        status: "error",
        message: "Failed to delete WorkoutSchedule",
      });
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
