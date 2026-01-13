const router = require("express").Router();
const { signup, login,getCurrentUser } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");
const {runNow}=require("../services/dailyLoadCalculation");


router.post("/signup", signup);
router.post("/login", login);
router.get('/me', authMiddleware, getCurrentUser);
router.post('/trigger', async (req, res) => {
  try {
    await runNow();  
    res.json({ message: 'Daily load calculation triggered successfully' });
  } catch (error) {
    console.error('Error triggering daily load calculation:', error);
    res.status(500).json({ error: 'Failed to trigger daily load calculation' });
  }
});

module.exports = router;
