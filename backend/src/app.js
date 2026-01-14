const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/course.routes");
const deadlineRoutes = require("./routes/deadline.routes");
const loadRoutes = require("./routes/load.routes");
const aiRoutes = require("./routes/aiRoutes");
const googleAuthRoutes = require("./routes/googleAuth.routes");
const calendarRoutes = require("./routes/calendar.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/deadlines", deadlineRoutes);
app.use("/load", loadRoutes);
app.use("/ai", aiRoutes);
app.use("/api/google", googleAuthRoutes);
app.use("/api/calendar", calendarRoutes);

// Global 404 Handler (JSON)
app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler (JSON)
app.use((err, req, res, next) => {
    console.error("Global Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
