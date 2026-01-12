const router = require("express").Router();
const { createCourse, getCourses } = require("../controllers/course.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createCourse);
router.get("/", authMiddleware, getCourses);

module.exports = router;
