const Deadline = require("../models/deadline");
const ProfessorConflictService = require("../services/professorService");

exports.createDeadline = async (req, res) => {
  try {
    const deadline = await Deadline.create(req.body);
    ProfessorConflictService
      .analyzeDeadlineImpact(deadline)
      .catch(err => console.error('Conflict analysis failed:', err));

    res.status(201).json({
      success: true,
      deadline
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDeadlines = async (req, res) => {
  const deadlines = await Deadline.find();
  res.json(deadlines);
};

exports.updateDeadline = async (req, res) => {
  const updated = await Deadline.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteDeadline = async (req, res) => {
  await Deadline.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
