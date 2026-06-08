const Battle = require('../models/Battle')
const Character = require('../models/Character')
const Enemy = require('../models/Enemy')
const Echo = require('../models/Echo')

const calcDamage = (attack, defense) => Math.max(1, attack - Math.floor(defense / 2) + Math.floor(Math.random() * 5))

exports.startBattle = async (req, res, next) => {
  try {
    const { enemyId } = req.body
    const character = await Character.findOne({ user: req.user._id, isActive: true }).populate('echoesCollected')
    if (!character) return res.status(404).json({ message: 'No active character' })
    if (character.stats.hp <= 0) return res.status(400).json({ message: 'Your character is defeated. Rest first.' })

    const enemy = await Enemy.findById(enemyId)
    if (!enemy) return res.status(404).json({ message: 'Enemy not found' })
    if (enemy.location !== character.currentLocation) {
      return res.status(400).json({ message: `This enemy is in ${enemy.location}. Travel there first.` })
    }

    const battle = await Battle.create({ character: character._id, enemy: enemy._id, location: character.currentLocation })
    res.status(201).json({ message: `Battle begins! ${character.name} vs ${enemy.name}!`, battleId: battle._id, enemy: { name: enemy.name, type: enemy.type, stats: enemy.stats }, character: { name: character.name, stats: character.stats } })
  } catch (err) { next(err) }
}

exports.takeTurn = async (req, res, next) => {
  try {
    const { action, echoId } = req.body
    const battle = await Battle.findById(req.params.battleId).populate('enemy')
    if (!battle || battle.outcome !== 'ongoing') return res.status(400).json({ message: 'Battle not found or already ended' })

    const character = await Character.findById(battle.character).populate('echoesCollected')
    const enemy = battle.enemy

    let enemyHp = battle.turns.length ? battle.turns[battle.turns.length - 1].enemyHpAfter : enemy.stats.hp
    let charHp   = battle.turns.length ? battle.turns[battle.turns.length - 1].characterHpAfter : character.stats.hp

    const turnNumber = battle.turns.length + 1
    let damageDealt = 0, healingDone = 0, echoUsed = null, actionLabel = action

    // Player turn
    if (action === 'attack') {
      damageDealt = calcDamage(character.stats.attack, enemy.stats.defense)
      enemyHp = Math.max(0, enemyHp - damageDealt)
    } else if (action === 'echo' && echoId) {
      const echo = character.echoesCollected.find(e => e._id.toString() === echoId)
      if (!echo) return res.status(400).json({ message: 'Echo not in your collection' })
      echoUsed = echo._id
      actionLabel = `Echo: ${echo.ability.name}`
      if (echo.ability.damage) { damageDealt = echo.ability.damage; enemyHp = Math.max(0, enemyHp - damageDealt) }
      if (echo.ability.healing) { healingDone = echo.ability.healing; charHp = Math.min(character.stats.maxHp, charHp + healingDone) }
    } else if (action === 'flee') {
      battle.outcome = 'fled'
      await battle.save()
      return res.json({ message: `${character.name} fled the battle!`, outcome: 'fled' })
    }

    battle.turns.push({ turn: turnNumber, actorType: 'character', action: actionLabel, echoUsed, damageDealt, healingDone, characterHpAfter: charHp, enemyHpAfter: enemyHp })

    // Check enemy defeated
    if (enemyHp <= 0) {
      battle.outcome = 'victory'
      battle.xpGained = enemy.xpReward
      battle.goldGained = enemy.goldReward

      character.xp += enemy.xpReward
      character.gold += enemy.goldReward
      character.stats.hp = charHp

      // Echo drop
      if (enemy.echoDropId) {
        const echoAlreadyHeld = character.echoesCollected.some(e => e._id.toString() === enemy.echoDropId.toString())
        if (!echoAlreadyHeld) {
          character.echoesCollected.push(enemy.echoDropId)
          battle.echoDropped = enemy.echoDropId
        }
      }
      await character.save()
      await battle.save()
      return res.json({ message: `Victory! ${enemy.name} is defeated!`, outcome: 'victory', xpGained: enemy.xpReward, goldGained: enemy.goldReward, echoDropped: enemy.echoDropId || null })
    }

    // Enemy turn
    const enemyDamage = calcDamage(enemy.stats.attack, character.stats.defense)
    charHp = Math.max(0, charHp - enemyDamage)
    battle.turns.push({ turn: turnNumber, actorType: 'enemy', action: 'attack', damageDealt: enemyDamage, healingDone: 0, characterHpAfter: charHp, enemyHpAfter: enemyHp })

    if (charHp <= 0) {
      battle.outcome = 'defeat'
      character.stats.hp = 1   // survive with 1hp on defeat
      await character.save()
      await battle.save()
      return res.json({ message: `${character.name} has been defeated... The Echoes grow silent.`, outcome: 'defeat' })
    }

    character.stats.hp = charHp
    await character.save()
    await battle.save()

    res.json({ message: `Turn ${turnNumber} complete`, yourDamage: damageDealt, enemyDamage, characterHp: charHp, enemyHp, ongoing: true })
  } catch (err) { next(err) }
}

exports.getBattle = async (req, res, next) => {
  try {
    const battle = await Battle.findById(req.params.battleId).populate('enemy', 'name type stats').populate('echoDropped', 'name rarity')
    if (!battle) return res.status(404).json({ message: 'Battle not found' })
    res.json({ battle })
  } catch (err) { next(err) }
}

exports.getBattleHistory = async (req, res, next) => {
  try {
    const character = await Character.findOne({ user: req.user._id, isActive: true })
    if (!character) return res.status(404).json({ message: 'No active character' })
    const battles = await Battle.find({ character: character._id }).populate('enemy', 'name type isBoss').sort({ createdAt: -1 }).limit(20)
    res.json({ battles })
  } catch (err) { next(err) }
}
