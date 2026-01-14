require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const {job}=require("./services/dailyLoadCalculation");

connectDB();
// job.start();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
