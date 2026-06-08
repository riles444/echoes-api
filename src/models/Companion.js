const mongoose = require('mongoose')

const companionSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  class:       { type: String, enum: ['Echo Knight', 'Echo Mage', 'Echo Ranger', 'Echo Healer'], required: true },
  description: { type: String, required: true },
  foundAt:     { type: String, required: true },
  skill: {
    name:        { type: String, required: true },
    description: { type: String, required: true },
    effect:      { type: String, required: true }
  },
  stats: {
    hp:      { type: Number, default: 80 },
    attack:  { type: Number, default: 8 },
    defense: { type: Number, default: 4 },
    speed:   { type: Number, default: 7 }
  },
  recruitCost: { type: Number, default: 0 },
  lore:        { type: String }
}, { timestamps: true })

module.exports = mongoose.model('Companion', companionSchema)
