const router = require("express").Router();
const { getLoad } = require("../controllers/load.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:studentId", authMiddleware, getLoad);

module.exports = router;
