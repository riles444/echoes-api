const Enemy = require('../models/Enemy')
const Character = require('../models/Character')

exports.getEnemiesByLocation = async (req, res, next) => {
  try {
    const character = await Character.findOne({ user: req.user._id, isActive: true })
    const location = req.query.location || (character ? character.currentLocation : null)
    if (!location) return res.status(400).json({ message: 'Provide a location or create a character first' })
    const enemies = await Enemy.find({ location }).sort({ isBoss: -1, 'stats.hp': 1 })
    res.json({ location, count: enemies.length, enemies })
  } catch (err) { next(err) }
}

exports.getEnemy = async (req, res, next) => {
  try {
    const enemy = await Enemy.findById(req.params.id).populate('echoDropId', 'name rarity ability')
    if (!enemy) return res.status(404).json({ message: 'Enemy not found' })
    res.json({ enemy })
  } catch (err) { next(err) }
}

exports.getAllEnemies = async (req, res, next) => {
  try {
    const { type, isBoss } = req.query
    const filter = {}
    if (type) filter.type = type
    if (isBoss !== undefined) filter.isBoss = isBoss === 'true'
    const enemies = await Enemy.find(filter).sort({ isBoss: -1 })
    res.json({ count: enemies.length, enemies })
  } catch (err) { next(err) }
}
