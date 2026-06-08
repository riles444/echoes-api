const Echo = require('../models/echo.model');

// POST /api/echoes
const createEcho = async (req, res) => {
  try {
    const { type, content, deliverAt, title } = req.body;

    if (new Date(deliverAt) <= new Date()) {
      return res.status(400).json({ message: 'Delivery date must be in the future' });
    }

    const echo = await Echo.create({
      user: req.user._id,
      type,
      content,
      deliverAt,
      title,
    });

    res.status(201).json({ message: 'Echo scheduled', echo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/echoes
const getEchoes = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;

    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (type) filter.type = type;

    const skip = (page - 1) * limit;

    const [echoes, total] = await Promise.all([
      Echo.find(filter).sort({ deliverAt: 1 }).skip(skip).limit(parseInt(limit)),
      Echo.countDocuments(filter),
    ]);

    res.json({
      echoes,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/echoes/:id
const getEchoById = async (req, res) => {
  try {
    const echo = await Echo.findOne({ _id: req.params.id, user: req.user._id });

    if (!echo) return res.status(404).json({ message: 'Echo not found' });

    res.json({ echo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/echoes/:id
const updateEcho = async (req, res) => {
  try {
    const echo = await Echo.findOne({ _id: req.params.id, user: req.user._id });

    if (!echo) return res.status(404).json({ message: 'Echo not found' });
    if (echo.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending echoes can be updated' });
    }

    const { content, deliverAt, title } = req.body;

    if (deliverAt && new Date(deliverAt) <= new Date()) {
      return res.status(400).json({ message: 'Delivery date must be in the future' });
    }

    if (content) echo.content = content;
    if (deliverAt) echo.deliverAt = deliverAt;
    if (title) echo.title = title;

    await echo.save();

    res.json({ message: 'Echo updated', echo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/echoes/:id
const deleteEcho = async (req, res) => {
  try {
    const echo = await Echo.findOne({ _id: req.params.id, user: req.user._id });

    if (!echo) return res.status(404).json({ message: 'Echo not found' });
    if (echo.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending echoes can be deleted' });
    }

    await echo.deleteOne();

    res.json({ message: 'Echo cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createEcho, getEchoes, getEchoById, updateEcho, deleteEcho };
