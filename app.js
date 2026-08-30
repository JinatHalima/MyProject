const express = require("express");
const path = require("path");
require("dotenv").config();

const { sequelize, connectDB } = require("./config/db");

const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Home page
app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "views", "index.html")
  );
});


// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Student Attendance API is running"
  });
});


// Attendance routes
app.use("/api/attendance", attendanceRoutes);


const PORT = process.env.PORT || 5000;


const startServer = async () => {
  try {

    await connectDB();

    await sequelize.sync();

    console.log("Database schema synchronized.");

    app.listen(PORT, () => {
      console.log(
        `Server running at http://localhost:${PORT}`
      );
    });

  } catch (error) {

    console.error(
      "Server startup failed:",
      error.message
    );

    process.exit(1);
  }
};


startServer();