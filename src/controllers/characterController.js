const Character = require('../models/Character')

const CLASS_STATS = {
  'Echo Knight': { hp: 140, maxHp: 140, attack: 18, defense: 12, speed: 8,  magic: 0  },
  'Echo Mage':   { hp: 90,  maxHp: 90,  attack: 8,  defense: 4,  speed: 7,  magic: 20 },
  'Echo Ranger': { hp: 110, maxHp: 110, attack: 15, defense: 6,  speed: 16, magic: 0  },
  'Echo Healer': { hp: 100, maxHp: 100, attack: 6,  defense: 8,  speed: 9,  magic: 15 }
}

exports.createCharacter = async (req, res, next) => {
  try {
    const { name, class: cls } = req.body
    const existing = await Character.findOne({ user: req.user._id, isActive: true })
    if (existing) return res.status(400).json({ message: 'You already have an active character. Delete it first to start over.' })

    const stats = CLASS_STATS[cls]
    if (!stats) return res.status(400).json({ message: 'Invalid class' })

    const character = await Character.create({ user: req.user._id, name, class: cls, stats })
    res.status(201).json({ message: `${name} the ${cls} begins their journey...`, character })
  } catch (err) { next(err) }
}

exports.getCharacter = async (req, res, next) => {
  try {
    const character = await Character.findOne({ user: req.user._id, isActive: true })
      .populate('echoesCollected', 'name rarity ability isGreatEcho')
      .populate('companionsRecruited', 'name class skill')
    if (!character) return res.status(404).json({ message: 'No active character found' })
    res.json({ character })
  } catch (err) { next(err) }
}

exports.levelUp = async (req, res, next) => {
  try {
    const character = await Character.findOne({ user: req.user._id, isActive: true })
    if (!character) return res.status(404).json({ message: 'No active character found' })

    const xpNeeded = character.level * 100
    if (character.xp < xpNeeded) {
      return res.status(400).json({ message: `Need ${xpNeeded - character.xp} more XP to level up` })
    }

    character.level += 1
    character.xp -= xpNeeded
    character.stats.maxHp += 10
    character.stats.hp = character.stats.maxHp
    character.stats.attack += 2
    character.stats.defense += 1
    character.stats.magic += character.class === 'Echo Mage' || character.class === 'Echo Healer' ? 3 : 0
    await character.save()

    res.json({ message: `${character.name} reached level ${character.level}!`, character })
  } catch (err) { next(err) }
}

exports.moveToLocation = async (req, res, next) => {
  try {
    const { location } = req.body
    const validLocations = ['Whispering Forest', 'Crystal Desert', 'Forgotten Kingdom', 'Echo Caverns', 'The City of Memories']
    if (!validLocations.includes(location)) {
      return res.status(400).json({ message: 'Unknown location', validLocations })
    }
    const character = await Character.findOneAndUpdate(
      { user: req.user._id, isActive: true },
      { currentLocation: location },
      { new: true }
    )
    if (!character) return res.status(404).json({ message: 'No active character' })
    res.json({ message: `${character.name} travels to ${location}`, currentLocation: location })
  } catch (err) { next(err) }
}

exports.makeChoice = async (req, res, next) => {
  try {
    const { choiceId, option } = req.body
    const character = await Character.findOne({ user: req.user._id, isActive: true })
    if (!character) return res.status(404).json({ message: 'No active character' })
    character.storyChoices.push({ choiceId, option })
    await character.save()
    res.json({ message: 'Choice recorded — your story shifts...', choice: { choiceId, option } })
  } catch (err) { next(err) }
}

exports.deleteCharacter = async (req, res, next) => {
  try {
    await Character.findOneAndUpdate({ user: req.user._id, isActive: true }, { isActive: false })
    res.json({ message: 'Character deleted. The Echoes fade... for now.' })
  } catch (err) { next(err) }
}
