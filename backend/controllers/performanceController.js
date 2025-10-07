const Performance = require("../models/Performance");

// Create Performance Record (Admin only)
exports.createPerformance = async (req, res) => {
  try {
    const newRecord = await Performance.create(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all performance records (with optional search/filter)
exports.getAllPerformance = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { staffName: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } }
      ];
    }
    const records = await Performance.find(query).sort({ reviewDate: -1 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single staff performance history
exports.getStaffPerformance = async (req, res) => {
  try {
    const { staffId } = req.params;
    const records = await Performance.find({ staffId }).sort({ reviewDate: -1 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update performance record
exports.updatePerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Performance.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete performance record
exports.deletePerformance = async (req, res) => {
  try {
    const { id } = req.params;
    await Performance.findByIdAndDelete(id);
    res.status(200).json({ message: "Performance record deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
