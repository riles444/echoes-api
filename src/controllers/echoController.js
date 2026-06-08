const Echo = require('../models/Echo')
const Character = require('../models/Character')

exports.getAllEchoes = async (req, res, next) => {
  try {
    const { rarity, location, isGreatEcho } = req.query
    const filter = {}
    if (rarity) filter.rarity = rarity
    if (location) filter.location = location
    if (isGreatEcho !== undefined) filter.isGreatEcho = isGreatEcho === 'true'
    const echoes = await Echo.find(filter).sort({ isGreatEcho: -1, rarity: 1 })
    res.json({ count: echoes.length, echoes })
  } catch (err) { next(err) }
}

exports.getEchoById = async (req, res, next) => {
  try {
    const echo = await Echo.findById(req.params.id)
    if (!echo) return res.status(404).json({ message: 'Echo not found' })
    res.json({ echo })
  } catch (err) { next(err) }
}

exports.getGreatEchoes = async (req, res, next) => {
  try {
    const echoes = await Echo.find({ isGreatEcho: true }).sort({ greatEchoNumber: 1 })
    const character = await Character.findOne({ user: req.user._id, isActive: true })
    const collectedIds = character ? character.echoesCollected.map(e => e.toString()) : []
    const result = echoes.map(e => ({
      ...e.toObject(),
      collected: collectedIds.includes(e._id.toString())
    }))
    res.json({ total: 7, found: result.filter(e => e.collected).length, greatEchoes: result })
  } catch (err) { next(err) }
}

exports.collectEcho = async (req, res, next) => {
  try {
    const echo = await Echo.findById(req.params.id)
    if (!echo) return res.status(404).json({ message: 'Echo not found' })

    const character = await Character.findOne({ user: req.user._id, isActive: true })
    if (!character) return res.status(404).json({ message: 'No active character' })

    if (character.echoesCollected.includes(echo._id)) {
      return res.status(400).json({ message: 'You have already absorbed this Echo' })
    }

    // Class bonus check
    if (echo.classBonus !== 'All' && echo.classBonus !== character.class) {
      return res.status(400).json({ message: `This Echo resonates only with the ${echo.classBonus} class` })
    }

    character.echoesCollected.push(echo._id)
    if (echo.ability.buffStat && echo.ability.buffAmount) {
      character.stats[echo.ability.buffStat] = (character.stats[echo.ability.buffStat] || 0) + echo.ability.buffAmount
    }
    await character.save()

    res.json({ message: `${character.name} absorbs the Echo of ${echo.name}!`, echo, unlockedAbility: echo.ability })
  } catch (err) { next(err) }
}
