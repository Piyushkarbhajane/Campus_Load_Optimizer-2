const router = require("express").Router();
const controller = require("../controllers/deadline.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, controller.createDeadline);
router.get("/", authMiddleware, controller.getDeadlines);
router.put("/:id", authMiddleware, controller.updateDeadline);
router.delete("/:id", authMiddleware, controller.deleteDeadline);

module.exports = router;
