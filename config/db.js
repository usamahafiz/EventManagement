const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Replace <db_password> with your actual MongoDB password
    const conn = await mongoose.connect(
      "MONGODB_URL",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
