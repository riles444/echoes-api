const mongoose = require('mongoose')

const enemySchema = new mongoose.Schema({
  name:        { type: String, required: true },
  type:        { type: String, enum: ['Shadow Echo', 'Lost Guardian', 'Memory Wraith', 'Ancient Titan'], required: true },
  location:    { type: String, required: true },
  isBoss:      { type: Boolean, default: false },
  stats: {
    hp:      { type: Number, required: true },
    attack:  { type: Number, required: true },
    defense: { type: Number, required: true },
    speed:   { type: Number, required: true }
  },
  xpReward:   { type: Number, required: true },
  goldReward: { type: Number, default: 0 },
  drops: [{ itemId: String, name: String, dropChance: Number }],
  echoDropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Echo', default: null },
  description: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('Enemy', enemySchema)
