const mongoose = require('mongoose')

const characterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  class: {
    type: String,
    enum: ['Echo Knight', 'Echo Mage', 'Echo Ranger', 'Echo Healer'],
    required: true
  },
  level:  { type: Number, default: 1 },
  xp:     { type: Number, default: 0 },
  stats: {
    hp:        { type: Number, default: 100 },
    maxHp:     { type: Number, default: 100 },
    attack:    { type: Number, default: 10 },
    defense:   { type: Number, default: 5 },
    speed:     { type: Number, default: 8 },
    magic:     { type: Number, default: 0 }
  },
  echoesCollected: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Echo' }],
  companionsRecruited: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Companion' }],
  currentLocation: { type: String, default: 'Whispering Forest' },
  storyChoices: [{ choiceId: String, option: String, timestamp: { type: Date, default: Date.now } }],
  inventory: [{ itemId: String, name: String, type: String, quantity: { type: Number, default: 1 } }],
  gold: { type: Number, default: 50 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model('Character', characterSchema)
