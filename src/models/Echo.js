const mongoose = require('mongoose')

const echoSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, required: true },
  civilization:{ type: String, required: true },
  location:    { type: String, required: true },
  rarity:      { type: String, enum: ['Common', 'Rare', 'Epic', 'Legendary'], default: 'Common' },
  isGreatEcho: { type: Boolean, default: false },
  greatEchoNumber: { type: Number, default: null },   // 1–7 for the Seven Great Echoes
  ability: {
    name:        { type: String, required: true },
    description: { type: String, required: true },
    damage:      { type: Number, default: 0 },
    healing:     { type: Number, default: 0 },
    buffStat:    { type: String, default: null },
    buffAmount:  { type: Number, default: 0 }
  },
  classBonus: { type: String, enum: ['Echo Knight', 'Echo Mage', 'Echo Ranger', 'Echo Healer', 'All'], default: 'All' },
  lore:        { type: String }
}, { timestamps: true })

module.exports = mongoose.model('Echo', echoSchema)
