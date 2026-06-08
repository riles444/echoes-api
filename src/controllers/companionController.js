const Companion = require('../models/Companion')
const Character = require('../models/Character')

exports.getAllCompanions = async (req, res, next) => {
  try {
    const companions = await Companion.find().sort({ class: 1 })
    const character = await Character.findOne({ user: req.user._id, isActive: true })
    const recruitedIds = character ? character.companionsRecruited.map(c => c.toString()) : []
    const result = companions.map(c => ({ ...c.toObject(), recruited: recruitedIds.includes(c._id.toString()) }))
    res.json({ count: result.length, companions: result })
  } catch (err) { next(err) }
}

exports.getCompanion = async (req, res, next) => {
  try {
    const companion = await Companion.findById(req.params.id)
    if (!companion) return res.status(404).json({ message: 'Companion not found' })
    res.json({ companion })
  } catch (err) { next(err) }
}

exports.recruitCompanion = async (req, res, next) => {
  try {
    const companion = await Companion.findById(req.params.id)
    if (!companion) return res.status(404).json({ message: 'Companion not found' })

    const character = await Character.findOne({ user: req.user._id, isActive: true })
    if (!character) return res.status(404).json({ message: 'No active character' })

    if (character.companionsRecruited.includes(companion._id)) {
      return res.status(400).json({ message: `${companion.name} is already in your party` })
    }
    if (companion.foundAt !== character.currentLocation) {
      return res.status(400).json({ message: `${companion.name} can only be recruited in ${companion.foundAt}` })
    }
    if (character.gold < companion.recruitCost) {
      return res.status(400).json({ message: `Not enough gold. Need ${companion.recruitCost}, you have ${character.gold}` })
    }

    character.gold -= companion.recruitCost
    character.companionsRecruited.push(companion._id)
    await character.save()

    res.json({ message: `${companion.name} joins your party!`, companion })
  } catch (err) { next(err) }
}
