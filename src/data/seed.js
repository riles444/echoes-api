require('dotenv').config()
const mongoose = require('mongoose')
const Echo = require('../models/Echo')
const Enemy = require('../models/Enemy')
const Companion = require('../models/Companion')

const echoes = [
  { name: 'The First Flame', description: 'A memory of the civilization that discovered fire magic', civilization: 'Pyreborn Empire', location: 'Whispering Forest', rarity: 'Legendary', isGreatEcho: true, greatEchoNumber: 1, ability: { name: 'Flame Surge', description: 'Unleash ancient fire upon an enemy', damage: 35, healing: 0 }, classBonus: 'All', lore: 'The oldest memory in existence. It burns with a warmth that never fades.' },
  { name: 'Crystal Whisper', description: 'A fragment of thought from a seer who saw all timelines', civilization: 'Crystal Seers', location: 'Crystal Desert', rarity: 'Legendary', isGreatEcho: true, greatEchoNumber: 2, ability: { name: 'Time Sight', description: 'See an enemy\'s next move, boosting speed', buffStat: 'speed', buffAmount: 5 }, classBonus: 'All', lore: 'To hold this Echo is to hear every possible future at once.' },
  { name: 'The Forgotten Throne', description: 'The final memory of a fallen king', civilization: 'Forgotten Kingdom', location: 'Forgotten Kingdom', rarity: 'Legendary', isGreatEcho: true, greatEchoNumber: 3, ability: { name: 'Royal Guard', description: 'Ancient defensive power hardens your armor', buffStat: 'defense', buffAmount: 8 }, classBonus: 'Echo Knight', lore: 'A crown without a head. A throne without a king. The Echo remembers both.' },
  { name: 'Voice of the Caverns', description: 'A song from the deepest tunnels where sound becomes magic', civilization: 'Stone Singers', location: 'Echo Caverns', rarity: 'Epic', isGreatEcho: true, greatEchoNumber: 4, ability: { name: 'Sonic Bloom', description: 'A sound wave that heals allies and stuns enemies', healing: 30 }, classBonus: 'Echo Healer', lore: 'The caves sing if you listen. Most people never stop to listen.' },
  { name: 'Memory Bloom', description: 'A peaceful memory from the greatest city ever built', civilization: 'City of Memories', location: 'The City of Memories', rarity: 'Legendary', isGreatEcho: true, greatEchoNumber: 5, ability: { name: 'Echo Wave', description: 'Releases a pulse of all collected memories as energy', damage: 20, healing: 15 }, classBonus: 'Echo Mage', lore: 'The city lives on in this Echo. Walk its streets without leaving the battlefield.' },
  { name: 'Hunter\'s Last Arrow', description: 'The final shot of the greatest ranger who ever lived', civilization: 'Forest Clans', location: 'Whispering Forest', rarity: 'Legendary', isGreatEcho: true, greatEchoNumber: 6, ability: { name: 'Phantom Arrow', description: 'An arrow from the past pierces through all defenses', damage: 40 }, classBonus: 'Echo Ranger', lore: 'They say the arrow never missed. Not once. Not even at the end.' },
  { name: 'The Void\'s Origin', description: 'A memory of the Void King before corruption — when he still protected history', civilization: 'Ancient Order', location: 'Forgotten Kingdom', rarity: 'Legendary', isGreatEcho: true, greatEchoNumber: 7, ability: { name: 'Balance Restore', description: 'The ultimate echo — massively boosts all stats', buffStat: 'attack', buffAmount: 12 }, classBonus: 'All', lore: 'Even darkness was once light. This Echo remembers what the Void King forgot.' },
  { name: 'Forest Wisp', description: 'A gentle memory of forest spirits', civilization: 'Wood Walkers', location: 'Whispering Forest', rarity: 'Common', isGreatEcho: false, ability: { name: 'Nature\'s Touch', description: 'A soft heal from the forest', healing: 15 }, classBonus: 'All' },
  { name: 'Sand Serpent Strike', description: 'A memory of a legendary desert warrior', civilization: 'Desert Tribes', location: 'Crystal Desert', rarity: 'Rare', isGreatEcho: false, ability: { name: 'Viper Lunge', description: 'A swift strike that bypasses defense', damage: 18 }, classBonus: 'Echo Ranger' }
]

const enemies = [
  { name: 'Shadow Lurker', type: 'Shadow Echo', location: 'Whispering Forest', isBoss: false, stats: { hp: 60, attack: 10, defense: 4, speed: 9 }, xpReward: 40, goldReward: 15, description: 'A shadow that mimics forgotten memories' },
  { name: 'Forest Wraith', type: 'Memory Wraith', location: 'Whispering Forest', isBoss: false, stats: { hp: 80, attack: 13, defense: 5, speed: 7 }, xpReward: 55, goldReward: 20, description: 'A spirit that guards ancient forest secrets' },
  { name: 'Thorn Guardian', type: 'Lost Guardian', location: 'Whispering Forest', isBoss: true, stats: { hp: 200, attack: 20, defense: 12, speed: 6 }, xpReward: 180, goldReward: 80, description: 'The ancient protector of the Whispering Forest — boss' },
  { name: 'Crystal Specter', type: 'Shadow Echo', location: 'Crystal Desert', isBoss: false, stats: { hp: 90, attack: 15, defense: 8, speed: 11 }, xpReward: 65, goldReward: 25, description: 'Refracted light from a broken timeline' },
  { name: 'Sand Titan', type: 'Ancient Titan', location: 'Crystal Desert', isBoss: true, stats: { hp: 280, attack: 28, defense: 18, speed: 4 }, xpReward: 250, goldReward: 120, description: 'An ancient colossus buried for millennia — boss' },
  { name: 'Ruined Knight', type: 'Lost Guardian', location: 'Forgotten Kingdom', isBoss: false, stats: { hp: 110, attack: 18, defense: 14, speed: 5 }, xpReward: 80, goldReward: 30, description: 'A knight who forgot why they were fighting' },
  { name: 'Void Sentinel', type: 'Shadow Echo', location: 'Forgotten Kingdom', isBoss: true, stats: { hp: 320, attack: 32, defense: 20, speed: 8 }, xpReward: 300, goldReward: 150, description: 'The Void King\'s herald — boss' },
  { name: 'Echo Bat', type: 'Shadow Echo', location: 'Echo Caverns', isBoss: false, stats: { hp: 50, attack: 8, defense: 3, speed: 14 }, xpReward: 35, goldReward: 12, description: 'A creature made of fragmented sound memories' },
  { name: 'Stone Behemoth', type: 'Ancient Titan', location: 'Echo Caverns', isBoss: true, stats: { hp: 350, attack: 25, defense: 25, speed: 3 }, xpReward: 320, goldReward: 160, description: 'The oldest living thing in the caverns — boss' },
  { name: 'Memory Shade', type: 'Memory Wraith', location: 'The City of Memories', isBoss: false, stats: { hp: 130, attack: 22, defense: 10, speed: 12 }, xpReward: 100, goldReward: 40, description: 'A wandering memory that lost its host' },
  { name: 'The Void King', type: 'Ancient Titan', location: 'The City of Memories', isBoss: true, stats: { hp: 999, attack: 50, defense: 35, speed: 15 }, xpReward: 9999, goldReward: 500, description: 'The final boss. Collects the Seven Great Echoes to defeat him.' }
]

const companions = [
  { name: 'Lyra', class: 'Echo Mage', description: 'A scholar who dedicated her life to studying ancient civilizations', foundAt: 'Whispering Forest', skill: { name: 'Arcane Echo', description: 'Amplifies the power of any Echo used in battle', effect: 'echo_damage_boost_20_percent' }, stats: { hp: 85, attack: 12, defense: 3, speed: 9 }, recruitCost: 0, lore: 'She heard an Echo at age seven. She\'s been chasing them ever since.' },
  { name: 'Kael', class: 'Echo Knight', description: 'A wandering warrior whose armor is etched with ancient runes', foundAt: 'Crystal Desert', skill: { name: 'Shield of Ages', description: 'Absorbs 30% of incoming damage once per battle', effect: 'damage_absorption_30_percent' }, stats: { hp: 160, attack: 20, defense: 16, speed: 6 }, recruitCost: 100, lore: 'He carries the weight of a kingdom that no longer exists.' },
  { name: 'Sable', class: 'Echo Ranger', description: 'A swift hunter who moves through shadows like a whisper', foundAt: 'Echo Caverns', skill: { name: 'Ghost Step', description: 'Increases the whole party\'s speed for 3 turns', effect: 'party_speed_boost_3_turns' }, stats: { hp: 100, attack: 17, defense: 5, speed: 20 }, recruitCost: 80, lore: 'Nobody knows where she came from. Even she\'s not sure anymore.' },
  { name: 'Elder Maren', class: 'Echo Healer', description: 'A wise healer who can hear Echoes others cannot sense', foundAt: 'The City of Memories', skill: { name: 'Memory Mend', description: 'Restores full HP to the party once per battle', effect: 'full_party_hp_restore' }, stats: { hp: 95, attack: 5, defense: 9, speed: 8 }, recruitCost: 150, lore: 'She has lived through three ages. The Echoes kept her here for a reason.' }
]

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  await Echo.deleteMany({})
  await Enemy.deleteMany({})
  await Companion.deleteMany({})

  await Echo.insertMany(echoes)
  await Enemy.insertMany(enemies)
  await Companion.insertMany(companions)

  console.log('Seeded: 9 Echoes (7 Great Echoes + 2 common), 11 Enemies, 4 Companions')
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
