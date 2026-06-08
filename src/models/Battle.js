const mongoose = require('mongoose')

const battleSchema = new mongoose.Schema({
  character: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', required: true },
  enemy:     { type: mongoose.Schema.Types.ObjectId, ref: 'Enemy', required: true },
  location:  { type: String, required: true },
  outcome:   { type: String, enum: ['victory', 'defeat', 'fled', 'ongoing'], default: 'ongoing' },
  turns: [{
    turn:          Number,
    actorType:     { type: String, enum: ['character', 'enemy'] },
    action:        String,
    echoUsed:      { type: mongoose.Schema.Types.ObjectId, ref: 'Echo', default: null },
    damageDealt:   { type: Number, default: 0 },
    healingDone:   { type: Number, default: 0 },
    characterHpAfter: Number,
    enemyHpAfter:     Number
  }],
  xpGained:   { type: Number, default: 0 },
  goldGained: { type: Number, default: 0 },
  echoDropped:{ type: mongoose.Schema.Types.ObjectId, ref: 'Echo', default: null }
}, { timestamps: true })

module.exports = mongoose.model('Battle', battleSchema)
