import { useState, useEffect, useCallback, useMemo } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────────
const QUESTS = [
  { id: 0,  name: "A call to the allies",                  skill: "Social",          reshuffle: "weekly", task: "Make contact with a friend",                                              time: "5 min",       bonus: "Hang out with them",        reward: 5 },
  { id: 1,  name: "The mean streets",                      skill: "Brawling",        reshuffle: "weekly", task: "Play a new fighting game",                                                time: "1 hour",      bonus: "Find a main",               reward: 6 },
  { id: 2,  name: "Seeking new challenges",                skill: "Discovery",       reshuffle: "weekly", task: "Install and play a game you haven't played in a while or a new game",    time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 3,  name: "Show them who's boss",                  skill: "Brawling",        reshuffle: "weekly", task: "Play SSBU online: Grind Zelda GSP",                                       time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 4,  name: "A new challenger approaches",           skill: "Brawling",        reshuffle: "weekly", task: "Play SSBU: Pick a random character and practice with them",               time: "1 hour",      bonus: "Look them up on UFD",        reward: 6 },
  { id: 5,  name: "Tame the wilds",                        skill: "Druidcraft",      reshuffle: "weekly", task: "Mow the lawn",                                                            time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 6,  name: "Pushing back the serpentis",            skill: "Druidcraft",      reshuffle: "no",     task: "Clear the beds in the front",                                             time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 7,  name: "Cull the kudzu",                        skill: "Druidcraft",      reshuffle: "no",     task: "Kill the ivy along the fence",                                            time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 8,  name: "Domestic Barrier",                      skill: "Mending",         reshuffle: "no",     task: "Paint the house",                                                         time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 9,  name: "Cleanse the font",                      skill: "Mending",         reshuffle: "no",     task: "Tend the water softener",                                                 time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 10, name: "Restore the shelf",                     skill: "Order",           reshuffle: "weekly", task: "Fold the laundry",                                                        time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 11, name: "Beware of spiders",                     skill: "Order",           reshuffle: "no",     task: "Clean the work room",                                                     time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 12, name: "Reclaiming the library",                skill: "Order",           reshuffle: "no",     task: "Clean the game room",                                                     time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 13, name: "Exploratory Cuisine",                   skill: "Discovery",       reshuffle: "daily",  task: "Cook something new",                                                      time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 14, name: "In search of fine dining",              skill: "Discovery",       reshuffle: "weekly", task: "Try a new restaurant",                                                    time: "varies",      bonus: "Try it with someone else",  reward: 4 },
  { id: 15, name: "A taste of discovery",                  skill: "Discovery",       reshuffle: "daily",  task: "Try a new drink",                                                         time: "varies",      bonus: null,                        reward: 2 },
  { id: 16, name: "Call the progeny",                      skill: "Social",          reshuffle: "daily",  task: "Make contact with one of the kiddos",                                     time: "5 min",       bonus: "Hang out with them",        reward: 5 },
  { id: 17, name: "Hail to the queen",                     skill: "Social",          reshuffle: "weekly", task: "Surprise your wife with something small",                                 time: "5 min",       bonus: "Steal a kiss",              reward: 5 },
  { id: 18, name: "Beaty sensei's bizarre adventures",     skill: "Sketchcraft",     reshuffle: "daily",  task: "Work on Beaty sensei's bizarre adventure stickers",                       time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 19, name: "Recording the fall",                    skill: "Sketchcraft",     reshuffle: "weekly", task: "Work on Lucifer",                                                         time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 20, name: "Bestow life",                           skill: "Sketchcraft",     reshuffle: "weekly", task: "Practice figure drawing",                                                 time: "30 minutes",  bonus: null,                        reward: 3 },
  { id: 21, name: "Scribe of the grimoire",                skill: "Strategist",      reshuffle: "weekly", task: "Build a magic deck",                                                      time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 22, name: "Only a newtype",                        skill: "Nimble Fingers",  reshuffle: "weekly", task: "Build a gundam",                                                          time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 23, name: "Wielding the exotic",                   skill: "Sketchcraft",     reshuffle: "weekly", task: "Try a new medium",                                                        time: "30 minutes",  bonus: null,                        reward: 3 },
  { id: 24, name: "The search for Animagus",               skill: "Focus",           reshuffle: "weekly", task: "Watch 3 episodes of a new anime",                                         time: "1 hr 30 min", bonus: null,                        reward: 9 },
  { id: 25, name: "Absolute Cinema",                       skill: "Focus",           reshuffle: "weekly", task: "Watch a movie",                                                           time: "varies",      bonus: "Watch it with someone",     reward: 6 },
  { id: 26, name: "Hunting for new rivals",                skill: "Brawling",        reshuffle: "weekly", task: "Play a fighting game at an arcade",                                       time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 27, name: "A new battlefield",                     skill: "Strategist",      reshuffle: "weekly", task: "Learn a new table top game",                                              time: "varies",      bonus: "Play it with someone",      reward: 6 },
  { id: 28, name: "Get in the mecha",                      skill: "Strategist",      reshuffle: "daily",  task: "Work on SO:T",                                                            time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 29, name: "I'm sorry mama",                        skill: "Order",           reshuffle: "no",     task: "Clean classroom closet",                                                  time: "2 hours",     bonus: null,                        reward: 12 },
  { id: 30, name: "An epic tale",                          skill: "Focus",           reshuffle: "daily",  task: "Listen to a fiction audio book",                                          time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 31, name: "Pages from the scholars",               skill: "Focus",           reshuffle: "daily",  task: "Listen to a non fiction audio book",                                      time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 32, name: "Builder of worlds",                     skill: "Dungeon Mastery", reshuffle: "weekly", task: "Work on the D&D campaign",                                                time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 33, name: "Building Adam",                         skill: "Dungeon Mastery", reshuffle: "weekly", task: "Make a character in a non D&D system",                                    time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 34, name: "Mender: Live up to your name",          skill: "Nimble Fingers",  reshuffle: "weekly", task: "Repair clothing",                                                         time: "30 minutes",  bonus: null,                        reward: 3 },
  { id: 35, name: "Pages from the mages",                  skill: "Dungeon Mastery", reshuffle: "weekly", task: "Read an RPG book",                                                        time: "30 minutes",  bonus: null,                        reward: 3 },
  { id: 36, name: "Master the dungeon",                    skill: "Dungeon Mastery", reshuffle: "weekly", task: "Make a dungeon",                                                          time: "30 minutes",  bonus: "Place it in your campaign", reward: 3 },
  { id: 37, name: "Rise from your grave",                  skill: "Necromancy",      reshuffle: "no",     task: "Harvest the lizard skeletons",                                            time: "30 minutes",  bonus: null,                        reward: 3 },
  { id: 38, name: "Whisper to the wires",                  skill: "Focus",           reshuffle: "daily",  task: "Continue working through Anthropic lessons",                              time: "30 minutes",  bonus: null,                        reward: 3 },
  { id: 39, name: "Casting a healing ritual",              skill: "Physique",        reshuffle: "daily",  task: "Rehab your shoulder",                                                     time: "30 minutes",  bonus: null,                        reward: 3 },
  { id: 40, name: "The warrior within",                    skill: "Physique",        reshuffle: "daily",  task: "Do a workout",                                                            time: "1 hour",      bonus: "Hit a PR",                  reward: 6 },
  { id: 41, name: "Build the guild",                       skill: "Strategist",      reshuffle: "daily",  task: "Work on the quest board app",                                             time: "1 hour",      bonus: null,                        reward: 6 },
  { id: 42, name: "The necromancer's dilemma",             skill: "Strategist",      reshuffle: "daily",  task: "Work on The Long Road Home",                                              time: "30 minutes",  bonus: null,                        reward: 3 },
  { id: 43, name: "Tinker of the console",                 skill: "Nimble Fingers",  reshuffle: "no",     task: "Repair the switch",                                                       time: "1 hr 30 min", bonus: null,                        reward: 9 },
  { id: 44, name: "Tinker of the control",                 skill: "Nimble Fingers",  reshuffle: "weekly", task: "Test and clean controllers",                                              time: "1 hr 30 min", bonus: "Clean 3 controllers",        reward: 9 },
  { id: 45, name: "Cursed Technique: Displaced Phantom",   skill: "Brawling",        reshuffle: "daily",  task: "Work on Displaced Phantom",                                               time: "30 minutes",  bonus: null,                        reward: 3 },
];

// ─── Milestones ────────────────────────────────────────────────────────────────
const MILESTONES = [
  // Brawling
  { id: "brawling_3",  name: "Novice Brawler",           type: "skill", skill: "Brawling",        threshold: 3,  rarity: "Common"    },
  { id: "brawling_6",  name: "Intermediate Brawler",     type: "skill", skill: "Brawling",        threshold: 6,  rarity: "Uncommon"  },
  { id: "brawling_9",  name: "Expert Brawler",           type: "skill", skill: "Brawling",        threshold: 9,  rarity: "Rare"      },
  { id: "brawling_12", name: "Master Brawler",           type: "skill", skill: "Brawling",        threshold: 12, rarity: "Legendary" },
  // Social
  { id: "social_3",    name: "Novice Bard",              type: "skill", skill: "Social",          threshold: 3,  rarity: "Common"    },
  { id: "social_6",    name: "Intermediate Bard",        type: "skill", skill: "Social",          threshold: 6,  rarity: "Uncommon"  },
  { id: "social_9",    name: "Expert Bard",              type: "skill", skill: "Social",          threshold: 9,  rarity: "Rare"      },
  { id: "social_12",   name: "Master Bard",              type: "skill", skill: "Social",          threshold: 12, rarity: "Legendary" },
  // Discovery
  { id: "discovery_3",  name: "Novice Explorer",         type: "skill", skill: "Discovery",       threshold: 3,  rarity: "Common"    },
  { id: "discovery_6",  name: "Intermediate Explorer",   type: "skill", skill: "Discovery",       threshold: 6,  rarity: "Uncommon"  },
  { id: "discovery_9",  name: "Expert Explorer",         type: "skill", skill: "Discovery",       threshold: 9,  rarity: "Rare"      },
  { id: "discovery_12", name: "Master Explorer",         type: "skill", skill: "Discovery",       threshold: 12, rarity: "Legendary" },
  // Druidcraft
  { id: "druid_3",     name: "Novice Druid",             type: "skill", skill: "Druidcraft",      threshold: 3,  rarity: "Common"    },
  { id: "druid_6",     name: "Intermediate Druid",       type: "skill", skill: "Druidcraft",      threshold: 6,  rarity: "Uncommon"  },
  { id: "druid_9",     name: "Expert Druid",             type: "skill", skill: "Druidcraft",      threshold: 9,  rarity: "Rare"      },
  { id: "druid_12",    name: "Master Druid",             type: "skill", skill: "Druidcraft",      threshold: 12, rarity: "Legendary" },
  // Mending
  { id: "mending_3",   name: "Novice Artificer",         type: "skill", skill: "Mending",         threshold: 3,  rarity: "Common"    },
  { id: "mending_6",   name: "Intermediate Artificer",   type: "skill", skill: "Mending",         threshold: 6,  rarity: "Uncommon"  },
  { id: "mending_9",   name: "Expert Artificer",         type: "skill", skill: "Mending",         threshold: 9,  rarity: "Rare"      },
  { id: "mending_12",  name: "Master Artificer",         type: "skill", skill: "Mending",         threshold: 12, rarity: "Legendary" },
  // Dungeon Mastery
  { id: "dungeon_3",   name: "Novice Worldcrafter",      type: "skill", skill: "Dungeon Mastery",  threshold: 3,  rarity: "Common"    },
  { id: "dungeon_6",   name: "Intermediate Worldcrafter",type: "skill", skill: "Dungeon Mastery",  threshold: 6,  rarity: "Uncommon"  },
  { id: "dungeon_9",   name: "Expert Worldcrafter",      type: "skill", skill: "Dungeon Mastery",  threshold: 9,  rarity: "Rare"      },
  { id: "dungeon_12",  name: "Master Worldcrafter",      type: "skill", skill: "Dungeon Mastery",  threshold: 12, rarity: "Legendary" },
  // Focus
  { id: "focus_3",     name: "Novice Sage",              type: "skill", skill: "Focus",            threshold: 3,  rarity: "Common"    },
  { id: "focus_6",     name: "Intermediate Sage",        type: "skill", skill: "Focus",            threshold: 6,  rarity: "Uncommon"  },
  { id: "focus_9",     name: "Expert Sage",              type: "skill", skill: "Focus",            threshold: 9,  rarity: "Rare"      },
  { id: "focus_12",    name: "Master Sage",              type: "skill", skill: "Focus",            threshold: 12, rarity: "Legendary" },
  // Necromancy
  { id: "necro_3",     name: "Novice Necromancer",       type: "skill", skill: "Necromancy",       threshold: 3,  rarity: "Common"    },
  { id: "necro_6",     name: "Intermediate Necromancer", type: "skill", skill: "Necromancy",       threshold: 6,  rarity: "Uncommon"  },
  { id: "necro_9",     name: "Expert Necromancer",       type: "skill", skill: "Necromancy",       threshold: 9,  rarity: "Rare"      },
  { id: "necro_12",    name: "Master Necromancer",       type: "skill", skill: "Necromancy",       threshold: 12, rarity: "Legendary" },
  // Nimble Fingers
  { id: "nimble_3",    name: "Novice Rogue",             type: "skill", skill: "Nimble Fingers",   threshold: 3,  rarity: "Common"    },
  { id: "nimble_6",    name: "Intermediate Rogue",       type: "skill", skill: "Nimble Fingers",   threshold: 6,  rarity: "Uncommon"  },
  { id: "nimble_9",    name: "Expert Rogue",             type: "skill", skill: "Nimble Fingers",   threshold: 9,  rarity: "Rare"      },
  { id: "nimble_12",   name: "Master Rogue",             type: "skill", skill: "Nimble Fingers",   threshold: 12, rarity: "Legendary" },
  // Order
  { id: "order_3",     name: "Novice Cleric",            type: "skill", skill: "Order",            threshold: 3,  rarity: "Common"    },
  { id: "order_6",     name: "Intermediate Cleric",      type: "skill", skill: "Order",            threshold: 6,  rarity: "Uncommon"  },
  { id: "order_9",     name: "Expert Cleric",            type: "skill", skill: "Order",            threshold: 9,  rarity: "Rare"      },
  { id: "order_12",    name: "Master Cleric",            type: "skill", skill: "Order",            threshold: 12, rarity: "Legendary" },
  // Physique
  { id: "physique_3",  name: "Novice Fighter",           type: "skill", skill: "Physique",         threshold: 3,  rarity: "Common"    },
  { id: "physique_6",  name: "Intermediate Fighter",     type: "skill", skill: "Physique",         threshold: 6,  rarity: "Uncommon"  },
  { id: "physique_9",  name: "Expert Fighter",           type: "skill", skill: "Physique",         threshold: 9,  rarity: "Rare"      },
  { id: "physique_12", name: "Master Fighter",           type: "skill", skill: "Physique",         threshold: 12, rarity: "Legendary" },
  // Sketchcraft
  { id: "sketch_3",    name: "Novice Runemage",          type: "skill", skill: "Sketchcraft",      threshold: 3,  rarity: "Common"    },
  { id: "sketch_6",    name: "Intermediate Runemage",    type: "skill", skill: "Sketchcraft",      threshold: 6,  rarity: "Uncommon"  },
  { id: "sketch_9",    name: "Expert Runemage",          type: "skill", skill: "Sketchcraft",      threshold: 9,  rarity: "Rare"      },
  { id: "sketch_12",   name: "Master Runemage",          type: "skill", skill: "Sketchcraft",      threshold: 12, rarity: "Legendary" },
  // Strategist
  { id: "strat_3",     name: "Novice Commander",         type: "skill", skill: "Strategist",       threshold: 3,  rarity: "Common"    },
  { id: "strat_6",     name: "Intermediate Commander",   type: "skill", skill: "Strategist",       threshold: 6,  rarity: "Uncommon"  },
  { id: "strat_9",     name: "Expert Commander",         type: "skill", skill: "Strategist",       threshold: 9,  rarity: "Rare"      },
  { id: "strat_12",    name: "Master Commander",         type: "skill", skill: "Strategist",       threshold: 12, rarity: "Legendary" },
  // Level milestones
  { id: "level_5",     name: "Novice Adventurer",        type: "level", threshold: 5,  rarity: "Common"    },
  { id: "level_10",    name: "Intermediate Adventurer",  type: "level", threshold: 10, rarity: "Uncommon"  },
  { id: "level_15",    name: "Expert Adventurer",        type: "level", threshold: 15, rarity: "Rare"      },
  { id: "level_20",    name: "Master Adventurer",        type: "level", threshold: 20, rarity: "Legendary" },
];

// ─── Loot Table ────────────────────────────────────────────────────────────────
const LOOT_TABLE = [
  { id: "loot_0",  name: "Refreshing drink",            rarity: "Common",    description: "Grab a soda or a fountain drink while you are out and about" },
  { id: "loot_1",  name: "Pack of magic cards",         rarity: "Uncommon",  description: "Purchase a booster pack of magic cards" },
  { id: "loot_2",  name: "Lesser controller accessory", rarity: "Common",    description: "Choose a small CandyCon accessory to pimp your controller" },
  { id: "loot_3",  name: "Greater controller accessory",rarity: "Uncommon",  description: "Choose a large CandyCon accessory to pimp your controller" },
  { id: "loot_4",  name: "50 cent magic card",          rarity: "Common",    description: "Pick a card from the 50 cent bin" },
  { id: "loot_5",  name: "Hair cut",                    rarity: "Rare",      description: "Make that hair cut appointment and add the VIP treatment" },
  { id: "loot_6",  name: "Yummy snack",                 rarity: "Common",    description: "Pick up a yummy snack while you are out and about" },
  { id: "loot_7",  name: "Sketchbook",                  rarity: "Uncommon",  description: "Treat yourself to a new sketch book" },
  { id: "loot_8",  name: "Go out to lunch",             rarity: "Uncommon",  description: "Go out to lunch maybe invite a friend" },
  { id: "loot_9",  name: "DLC",                         rarity: "Uncommon",  description: "Pick up a DLC pack and breathe new life into one of your games" },
  { id: "loot_10", name: "Discounted steam game",       rarity: "Rare",      description: "Peruse the steam summer sale and pick a new game" },
  { id: "loot_11", name: "Switch 2 game",               rarity: "Legendary", description: "Make your way to gamestop and pick up a new switch 2 game" },
  { id: "loot_12", name: "Cool t shirt",                rarity: "Uncommon",  description: "Go find a cool anime or comic t-shirt" },
  { id: "loot_13", name: "Markers",                     rarity: "Uncommon",  description: "New markers may inspire new artwork" },
  { id: "loot_14", name: "Pens",                        rarity: "Common",    description: "Good for fine linework" },
  { id: "loot_15", name: "Rpg book",                    rarity: "Legendary", description: "New stories, new tools, new dungeons" },
  { id: "loot_16", name: "Dice",                        rarity: "Uncommon",  description: "Can you ever have enough?" },
  { id: "loot_17", name: "D20",                         rarity: "Common",    description: "Either a standard or a spindown, your choice!" },
  { id: "loot_18", name: "Rpg accessory",               rarity: "Rare",      description: "Spell cards, tokens, map packs, monsters... something to inspire." },
  { id: "loot_19", name: "Miniature",                   rarity: "Uncommon",  description: "Will it be a hero, a villain, or a monster?" },
  { id: "loot_20", name: "Spray paint",                 rarity: "Uncommon",  description: "A new color for your next Gundam build" },
  { id: "loot_21", name: "Rent a game",                 rarity: "Uncommon",  description: "Peruse the rental shelf at Valhallas" },
  { id: "loot_22", name: "Card game",                   rarity: "Rare",      description: "There's just something about shuffling cards" },
  { id: "loot_23", name: "Board game",                  rarity: "Legendary", description: "A new addition for family game night" },
  { id: "loot_24", name: "Chili dog from Mugs up",      rarity: "Uncommon",  description: "Get them while you can" },
  { id: "loot_25", name: "Shakespeares Slice",          rarity: "Uncommon",  description: "Best pizza slice in town" },
];

const RARITY_STYLES = {
  Common:    { color: "#aaaaaa", glow: "#aaaaaa44", label: "Common",    icon: "○" },
  Uncommon:  { color: "#4fc3f7", glow: "#4fc3f744", label: "Uncommon",  icon: "◈" },
  Rare:      { color: "#ce93d8", glow: "#ce93d844", label: "Rare",      icon: "◆" },
  Legendary: { color: "#ffd54f", glow: "#ffd54f66", label: "Legendary", icon: "✦" },
};

function rollLoot(rarity) {
  const pool = LOOT_TABLE.filter(l => l.rarity === rarity);
  if (!pool.length) return null;
  return { ...pool[Math.floor(Math.random() * pool.length)], instanceId: `inv_${Date.now()}_${Math.random()}` };
}

function checkMilestones(newProg, oldProg, milestones = MILESTONES) {
  // Returns array of newly triggered milestones
  const newLevel = Math.floor(newProg.xp / XP_PER_LEVEL) + 1;
  const oldLevel = Math.floor(oldProg.xp / XP_PER_LEVEL) + 1;
  const triggered = [];
  for (const m of milestones) {
    if (newProg.earnedMilestones?.includes(m.id)) continue;
    if (m.type === "level" && newLevel >= m.threshold && (oldLevel < m.threshold || !oldProg.earnedMilestones?.includes(m.id))) {
      triggered.push(m);
    } else if (m.type === "skill") {
      const newScore = newProg.skillScores[m.skill] ?? 0;
      const oldScore = oldProg.skillScores[m.skill] ?? 0;
      if (newScore >= m.threshold && oldScore < m.threshold) {
        triggered.push(m);
      }
    }
  }
  return triggered;
}

const SKILL_COLORS = {
  "Social":          { bg: "#1a2a3a", accent: "#4fc3f7", icon: "🤝" },
  "Brawling":        { bg: "#2a1a1a", accent: "#ef5350", icon: "🥊" },
  "Discovery":       { bg: "#1a2a1a", accent: "#66bb6a", icon: "🧭" },
  "Druidcraft":      { bg: "#1a2618", accent: "#81c784", icon: "🌿" },
  "Mending":         { bg: "#2a2018", accent: "#ffb74d", icon: "🔧" },
  "Order":           { bg: "#1e1e2e", accent: "#ce93d8", icon: "📋" },
  "Sketchcraft":     { bg: "#1a1a2e", accent: "#f48fb1", icon: "✏️" },
  "Strategist":      { bg: "#1a1f2e", accent: "#64b5f6", icon: "♟️" },
  "Nimble Fingers":  { bg: "#2a2018", accent: "#ffd54f", icon: "🛠️" },
  "Focus":           { bg: "#181828", accent: "#b39ddb", icon: "🎯" },
  "Dungeon Mastery": { bg: "#1e1218", accent: "#f06292", icon: "🎲" },
  "Necromancy":      { bg: "#0e0e1a", accent: "#80cbc4", icon: "💀" },
  "Physique":        { bg: "#1a2010", accent: "#aed581", icon: "💪" },
};

const ALL_SKILLS = Object.keys(SKILL_COLORS);
const RESHUFFLE_LABEL = { daily: "Daily", weekly: "Weekly", no: "One-time" };
const RESHUFFLE_COLOR = { daily: "#4fc3f7", weekly: "#ffd54f", no: "#ef9a9a" };
const HAND_SIZE = 5;
const XP_PER_LEVEL = 30;
const STORAGE_KEY = "quest_board_v3";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function saveState(s) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {} }

function calcXP(base, bonusCompleted) { return bonusCompleted ? Math.round(base * 1.5) : base; }

function buildFreshDeck(retiredIds = []) {
  return shuffleArr(QUESTS.map(q => q.id).filter(id => !retiredIds.includes(id)));
}

function dealHand(deck, size, guaranteedSkill = null, retiredIds = []) {
  let pool = [...deck];
  let hand = [];

  if (guaranteedSkill) {
    const skillIdx = pool.findIndex(id => {
      const q = QUESTS.find(q => q.id === id);
      return q && q.skill === guaranteedSkill;
    });
    if (skillIdx !== -1) {
      hand.push(pool[skillIdx]);
      pool.splice(skillIdx, 1);
    }
  }

  while (hand.length < size && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    hand.push(pool[idx]);
    pool.splice(idx, 1);
  }

  return { hand, deck: pool };
}

const emptyProgress = () => ({
  xp: 0,
  retiredIds: [],
  skillScores: {},
  history: [],
  earnedMilestones: [],  // milestone ids earned
  inventory: [],         // [{ instanceId, name, rarity, description }]
});

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  // screen: "start" | "board" | "character" | "history"
  const [screen, setScreen] = useState("start");
  const [progress, setProgress] = useState(null);          // persistent stats
  const [hand, setHand] = useState([]);
  const [deck, setDeck] = useState([]);
  const [celebrateId, setCelebrateId] = useState(null);
  const [boardTab, setBoardTab] = useState("board");
  const [filterSkill, setFilterSkill] = useState("All");
  const [customQuests, setCustomQuests] = useState([]);
  const [customLoot, setCustomLoot] = useState([]);
  const [customMilestones, setCustomMilestones] = useState([]);
  const [lootModal, setLootModal] = useState(null); // { milestone, loot } or null

  // 3 random skills shown on start screen — fixed per mount
  const startSkills = useMemo(() => shuffleArr(ALL_SKILLS).slice(0, 3), []);

  // Load persisted progress on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setProgress(saved.progress ?? emptyProgress());
      setCustomQuests(saved.customQuests ?? []);
      setCustomLoot(saved.customLoot ?? []);
      setCustomMilestones(saved.customMilestones ?? []);
      if (saved.hand && saved.hand.length > 0) {
        setHand(saved.hand);
        setDeck(saved.deck ?? []);
        setScreen("board");
      }
    } else {
      setProgress(emptyProgress());
    }
  }, []);

  const persist = useCallback((prog, h, d, cq, cl, cm) => {
    saveState({ progress: prog, hand: h, deck: d, customQuests: cq, customLoot: cl, customMilestones: cm });
  }, []);

  // ── Start screen actions ───────────────────────────────────────────────────
  const startAdventure = useCallback((guaranteedSkill = null) => {
    if (!progress) return;
    const freshDeck = buildFreshDeck(progress.retiredIds);
    const { hand: newHand, deck: newDeck } = dealHand(freshDeck, HAND_SIZE, guaranteedSkill, progress.retiredIds);
    setHand(newHand);
    setDeck(newDeck);
    setBoardTab("board");
    persist(progress, newHand, newDeck, customQuests, customLoot, customMilestones);
    setScreen("board");
  }, [progress, persist, customQuests, customLoot, customMilestones]);

  // ── Board actions ──────────────────────────────────────────────────────────
  const update = useCallback((newProg, newHand, newDeck) => {
    setProgress(newProg);
    setHand(newHand);
    setDeck(newDeck);
    persist(newProg, newHand, newDeck, customQuests, customLoot, customMilestones);
  }, [persist, customQuests, customLoot, customMilestones]);

  const drawReplacement = (h, d) => {
    if (d.length === 0 || h.length >= HAND_SIZE) return { h, d };
    const idx = Math.floor(Math.random() * d.length);
    const nd = [...d]; const [drawn] = nd.splice(idx, 1);
    return { h: [...h, drawn], d: nd };
  };

  const completeQuest = useCallback((questId, bonusCompleted) => {
    if (!progress) return;
    const quest = [...QUESTS, ...customQuests].find(q => q.id === questId);
    if (!quest) return;
    const xpEarned = calcXP(quest.reward, bonusCompleted && !!quest.bonus);
    let newHand = hand.filter(id => id !== questId);
    let newDeck = [...deck];
    let newRetired = [...progress.retiredIds];

    if (quest.reshuffle === "no") { newRetired.push(questId); }
    else { newDeck = shuffleArr([...newDeck, questId]); }

    const r = drawReplacement(newHand, newDeck);
    newHand = r.h; newDeck = r.d;

    const newSkillScores = { ...progress.skillScores, [quest.skill]: (progress.skillScores[quest.skill] ?? 0) + 1 };
    const entry = { questId, name: quest.name, skill: quest.skill, xpEarned, bonusCompleted: bonusCompleted && !!quest.bonus, timestamp: Date.now(), type: "complete" };
    const newProgPartial = { ...progress, xp: progress.xp + xpEarned, retiredIds: newRetired, skillScores: newSkillScores, history: [entry, ...progress.history] };

    // Check for newly triggered milestones (built-in + custom)
    const allMilestones = [...MILESTONES, ...customMilestones];
    const triggered = checkMilestones(newProgPartial, progress, allMilestones);
    let newEarned = [...(progress.earnedMilestones ?? [])];
    let newInventory = [...(progress.inventory ?? [])];
    const pendingLoot = [];
    const allLoot = [...LOOT_TABLE, ...customLoot];
    for (const m of triggered) {
      newEarned.push(m.id);
      const pool = allLoot.filter(l => l.rarity === m.rarity);
      const loot = pool.length ? { ...pool[Math.floor(Math.random() * pool.length)], instanceId: `inv_${Date.now()}_${Math.random()}` } : null;
      if (loot) { newInventory.push(loot); pendingLoot.push({ milestone: m, loot }); }
    }
    const newProg = { ...newProgPartial, earnedMilestones: newEarned, inventory: newInventory };

    update(newProg, newHand, newDeck);
    setCelebrateId(questId);
    setTimeout(() => setCelebrateId(null), 1800);
    if (pendingLoot.length > 0) setTimeout(() => setLootModal(pendingLoot[0]), 1900);
  }, [progress, hand, deck, update, customQuests]);

  const progressQuest = useCallback((questId) => {
    if (!progress) return;
    const quest = [...QUESTS, ...customQuests].find(q => q.id === questId);
    if (!quest) return;
    let newHand = hand.filter(id => id !== questId);
    let newDeck = shuffleArr([...deck, questId]);
    const r = drawReplacement(newHand, newDeck);
    const entry = { questId, name: quest.name, skill: quest.skill, xpEarned: 1, bonusCompleted: false, timestamp: Date.now(), type: "progress" };
    const newSkillScores = { ...progress.skillScores, [quest.skill]: (progress.skillScores[quest.skill] ?? 0) + 1 };
    const newProgPartial = { ...progress, xp: progress.xp + 1, skillScores: newSkillScores, history: [entry, ...progress.history] };

    // Check milestones
    const triggered = checkMilestones(newProgPartial, progress);
    let newEarned = [...(progress.earnedMilestones ?? [])];
    let newInventory = [...(progress.inventory ?? [])];
    const pendingLoot = [];
    for (const m of triggered) {
      newEarned.push(m.id);
      const loot = rollLoot(m.rarity);
      if (loot) { newInventory.push(loot); pendingLoot.push({ milestone: m, loot }); }
    }
    const newProg = { ...newProgPartial, earnedMilestones: newEarned, inventory: newInventory };

    update(newProg, r.h, r.d);
    if (pendingLoot.length > 0) setTimeout(() => setLootModal(pendingLoot[0]), 400);
  }, [progress, hand, deck, update, customQuests]);

  const discardCard = useCallback((questId) => {
    if (!progress) return;
    const quest = [...QUESTS, ...customQuests].find(q => q.id === questId);
    let newHand = hand.filter(id => id !== questId);
    let newDeck = quest.reshuffle !== "no" ? shuffleArr([...deck, questId]) : [...deck];
    const r = drawReplacement(newHand, newDeck);
    update(progress, r.h, r.d);
  }, [progress, hand, deck, update]);

  const reshuffleFromHistory = useCallback((questId) => {
    if (!progress) return;
    const firstIdx = progress.history.findIndex(h => h.questId === questId && h.type === "complete");
    if (firstIdx === -1) return;
    const newHistory = progress.history.filter((_, i) => i !== firstIdx);
    const newDeck = shuffleArr([...deck, questId]);
    const newProg = { ...progress, history: newHistory };
    update(newProg, hand, newDeck);
  }, [progress, hand, deck, update]);

  const useItem = useCallback((instanceId) => {
    if (!progress) return;
    const newInventory = (progress.inventory ?? []).filter(i => i.instanceId !== instanceId);
    const newProg = { ...progress, inventory: newInventory };
    update(newProg, hand, deck);
  }, [progress, hand, deck, update]);

  const deleteQuest = useCallback((questId) => {
    // Remove from hand, deck, and customQuests (if custom). Permanently gone.
    const newHand = hand.filter(id => id !== questId);
    const newDeck = deck.filter(id => id !== questId);
    const newRetired = [...(progress?.retiredIds ?? []), questId];
    const newCustomQuests = customQuests.filter(q => q.id !== questId);
    setCustomQuests(newCustomQuests);
    const newProg = progress ? { ...progress, retiredIds: newRetired } : progress;
    if (newProg) setProgress(newProg);
    setHand(newHand);
    setDeck(newDeck);
    persist(newProg ?? progress, newHand, newDeck, newCustomQuests, customLoot, customMilestones);
  }, [hand, deck, progress, customQuests, customLoot, customMilestones, persist]);

  const addCustomLoot = useCallback((newLootItem) => {
    const withNew = [...customLoot, newLootItem];
    setCustomLoot(withNew);
    persist(progress, hand, deck, customQuests, withNew, customMilestones);
  }, [customLoot, customMilestones, progress, hand, deck, customQuests, persist]);

  const addCustomMilestone = useCallback((newMilestone) => {
    const withNew = [...customMilestones, newMilestone];
    setCustomMilestones(withNew);
    persist(progress, hand, deck, customQuests, customLoot, withNew);
  }, [customMilestones, customLoot, progress, hand, deck, customQuests, persist]);

  const addCustomQuest = useCallback((newQuest) => {
    const withNew = [...customQuests, newQuest];
    setCustomQuests(withNew);
    // Immediately shuffle the new quest into the deck
    const newDeck = shuffleArr([...deck, newQuest.id]);
    setDeck(newDeck);
    persist(progress, hand, newDeck, withNew, customLoot, customMilestones);
    setBoardTab("board");
  }, [customQuests, customLoot, customMilestones, deck, hand, progress, persist]);

  const resetAll = useCallback(() => {
    const p = emptyProgress();
    setProgress(p);
    setHand([]);
    setDeck([]);
    setCustomQuests([]); setCustomLoot([]); setCustomMilestones([]);
    saveState({ progress: p, hand: [], deck: [], customQuests: [], customLoot: [], customMilestones: [] });
    setScreen("start");
  }, []);

  if (!progress) return <div style={{ color: "#888", padding: 40, textAlign: "center" }}>Summoning the guild hall…</div>;

  const level = Math.floor(progress.xp / XP_PER_LEVEL) + 1;
  const levelXp = progress.xp % XP_PER_LEVEL;

  // ── Render ─────────────────────────────────────────────────────────────────
  if (screen === "start") {
    return <StartScreen
      progress={progress} level={level} levelXp={levelXp}
      startSkills={startSkills}
      hasActiveHand={hand.length > 0}
      onStart={startAdventure}
      onContinue={() => setScreen("board")}
      onViewCharacter={() => setScreen("character")}
      onViewHistory={() => setScreen("history")}
      onReset={resetAll}
    />;
  }

  if (screen === "character") {
    return <FullPageSheet
      progress={progress} level={level}
      onBack={() => setScreen("start")}
    />;
  }

  if (screen === "history") {
    return <FullPageHistory
      progress={progress}
      onReshuffle={reshuffleFromHistory}
      onBack={() => setScreen("start")}
    />;
  }

  // ── Board screen ────────────────────────────────────────────────────────────
  const allQuests = [...QUESTS, ...customQuests];
  const handQuests = hand.map(id => allQuests.find(q => q.id === id)).filter(Boolean);
  const skills = ["All", ...Array.from(new Set(allQuests.map(q => q.skill))).sort()];
  const allFiltered = allQuests.filter(q => filterSkill === "All" || q.skill === filterSkill);

  const TABS = [
    { id: "board",      label: "🃏", title: "Hand" },
    { id: "all",        label: "📜", title: "All Quests" },
    { id: "char",       label: "👤", title: "Character" },
    { id: "create",     label: "✦",  title: "Create", isCreate: true },
    { id: "milestones", label: "🏆", title: "Milestones" },
    { id: "inventory",  label: "🎒", title: "Inventory" },
    { id: "hist",       label: "📖", title: "History" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a14 0%, #0f0f1f 60%, #0a1420 100%)", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#e8e8f0" }}>
      {/* Header */}
      <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setScreen("start")} style={{ background: "transparent", border: "1px solid #2a2a40", color: "#6060a0", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "#c9b8ff"; e.currentTarget.style.color = "#c9b8ff"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "#2a2a40"; e.currentTarget.style.color = "#6060a0"; }}>
            ← Guild Hall
          </button>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.06em", color: "#c9b8ff" }}>⚔ QUEST BOARD</div>
            <div style={{ fontSize: 10, color: "#4040a0" }}>{QUESTS.length - progress.retiredIds.length} available · {deck.length} in deck</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#9090b8", marginBottom: 3 }}>
              LVL <span style={{ color: "#ffd54f", fontWeight: 700, fontSize: 14 }}>{level}</span>
              <span style={{ color: "#333", margin: "0 5px" }}>·</span>
              <span style={{ color: "#c9b8ff" }}>{progress.xp} XP</span>
            </div>
            <div style={{ width: 130, height: 5, background: "#1a1a30", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${(levelXp / XP_PER_LEVEL) * 100}%`, height: "100%", background: "linear-gradient(90deg, #7c4dff, #c9b8ff)", borderRadius: 3, transition: "width 0.5s" }} />
            </div>
            <div style={{ fontSize: 9, color: "#333", marginTop: 2 }}>{levelXp}/{XP_PER_LEVEL} to next</div>
          </div>
          <button onClick={resetAll} style={{ background: "transparent", border: "1px solid #2a2a40", color: "#444", padding: "5px 8px", borderRadius: 6, cursor: "pointer", fontSize: 11 }} title="Reset everything">↺ Reset</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.2)", paddingLeft: 12 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setBoardTab(t.id)} title={t.title} style={{
            background: "transparent", border: "none",
            borderBottom: boardTab === t.id ? `2px solid ${t.isCreate ? "#66bb6a" : "#c9b8ff"}` : "2px solid transparent",
            color: boardTab === t.id ? (t.isCreate ? "#66bb6a" : "#c9b8ff") : (t.isCreate ? "#3a6040" : "#5050a0"),
            padding: "9px 18px", cursor: "pointer",
            fontSize: t.isCreate ? 20 : 18,
            fontWeight: 600,
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: "22px 18px" }}>
        {boardTab === "board" && (
          <>
            <div style={{ marginBottom: 16, color: "#4040a0", fontSize: 12 }}>Your active hand — complete, progress, or swap cards.</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
              {handQuests.map(quest => (
                <QuestCard key={quest.id} quest={quest}
                  onComplete={b => completeQuest(quest.id, b)}
                  onProgress={() => progressQuest(quest.id)}
                  onDiscard={() => discardCard(quest.id)}
                  celebrating={celebrateId === quest.id}
                  isRetired={progress.retiredIds.includes(quest.id)}
                />
              ))}
              {handQuests.length < HAND_SIZE && deck.length > 0 && (
                <button onClick={() => { const nd = [...deck]; const idx = Math.floor(Math.random()*nd.length); const [drawn] = nd.splice(idx,1); update(progress, [...hand, drawn], nd); }}
                  style={{ background: "rgba(255,255,255,0.02)", border: "2px dashed rgba(255,255,255,0.07)", borderRadius: 16, cursor: "pointer", color: "#2a2a60", fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 180 }}>+</button>
              )}
            </div>
          </>
        )}

        {boardTab === "all" && (
          <>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {skills.map(s => {
                const col = SKILL_COLORS[s];
                return <button key={s} onClick={() => setFilterSkill(s)} style={{
                  background: filterSkill === s ? (col?.accent ?? "#c9b8ff") + "22" : "transparent",
                  border: `1px solid ${filterSkill === s ? (col?.accent ?? "#c9b8ff") : "#2a2a40"}`,
                  color: filterSkill === s ? (col?.accent ?? "#c9b8ff") : "#4040a0",
                  padding: "3px 10px", borderRadius: 20, cursor: "pointer", fontSize: 11,
                }}>{col?.icon ?? ""} {s}</button>;
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 }}>
              {allFiltered.map(quest => (
                <QuestCard key={quest.id} quest={quest}
                  onComplete={b => { completeQuest(quest.id, b); setBoardTab("board"); }}
                  onProgress={() => { progressQuest(quest.id); setBoardTab("board"); }}
                  onDiscard={null}
                  onDelete={() => deleteQuest(quest.id)}
                  celebrating={celebrateId === quest.id}
                  isRetired={progress.retiredIds.includes(quest.id)}
                  inHand={hand.includes(quest.id)}
                />
              ))}
            </div>
          </>
        )}

        {boardTab === "char" && <CharacterSheet skillScores={progress.skillScores} xp={progress.xp} level={level} history={progress.history} />}
        {boardTab === "hist" && <HistoryLog history={progress.history} onReshuffle={reshuffleFromHistory} retiredIds={progress.retiredIds} />}
        {boardTab === "create" && <CreateHub onAddQuest={addCustomQuest} onAddLoot={addCustomLoot} onAddMilestone={addCustomMilestone} allQuests={allQuests} />}
        {boardTab === "milestones" && <MilestonesTab earnedMilestones={progress.earnedMilestones ?? []} skillScores={progress.skillScores} level={level} customMilestones={customMilestones} />}
        {boardTab === "inventory" && <InventoryTab inventory={progress.inventory ?? []} onUse={useItem} />}
      </div>

      {/* Loot Modal */}
      {lootModal && <LootModal data={lootModal} onClose={() => setLootModal(null)} />}
    </div>
  );
}

// ─── Start Screen ──────────────────────────────────────────────────────────────
function StartScreen({ progress, level, levelXp, startSkills, hasActiveHand, onStart, onContinue, onViewCharacter, onViewHistory, onReset }) {
  const hasHistory = progress.history.length > 0;

  const options = [
    ...(hasActiveHand ? [{
      id: "continue",
      label: "Continue my adventure",
      icon: "▶️",
      accent: "#ffd54f",
      onClick: onContinue,
    }] : []),
    {
      id: "start",
      label: "Start my adventure",
      icon: "⚔️",
      accent: "#c9b8ff",
      onClick: () => onStart(null),
    },
    ...startSkills.map(skill => ({
      id: `skill_${skill}`,
      label: `+ ${SKILL_COLORS[skill].icon} ${skill}`,
      accent: SKILL_COLORS[skill].accent,
      onClick: () => onStart(skill),
      isSkill: true,
    })),
    {
      id: "character",
      label: "👤  Character Sheet",
      accent: "#64b5f6",
      onClick: onViewCharacter,
    },
    {
      id: "history",
      label: "📖  Quest History",
      accent: "#81c784",
      onClick: onViewHistory,
      disabled: !hasHistory,
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 30%, #1a1040 0%, #0a0a14 60%, #06060f 100%)",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: "#e8e8f0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient glow orbs */}
      <div style={{ position: "absolute", top: "15%", left: "20%", width: 300, height: 300, background: "radial-gradient(circle, rgba(124,77,255,0.08) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "15%", width: 250, height: 250, background: "radial-gradient(circle, rgba(79,195,247,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      {/* Crest / logo */}
      <div style={{ fontSize: 56, marginBottom: 8, filter: "drop-shadow(0 0 24px rgba(201,184,255,0.4))" }}>⚔</div>

      {/* Title */}
      <div style={{ fontSize: 13, letterSpacing: "0.25em", color: "#5050a0", textTransform: "uppercase", marginBottom: 10 }}>The Adventurer's Guild</div>
      <h1 style={{ fontSize: "clamp(22px, 5vw, 34px)", fontWeight: 800, textAlign: "center", margin: "0 0 10px", color: "#e8e8f8", lineHeight: 1.2 }}>
        Welcome to the Guild Hall
      </h1>
      <p style={{ fontSize: 15, color: "#7070a0", textAlign: "center", marginBottom: 32, maxWidth: 400, lineHeight: 1.6 }}>
        What kind of adventure are you looking for today?
      </p>

      {/* XP bar if returning player */}
      {progress.xp > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "8px 16px" }}>
          <div style={{ fontSize: 12, color: "#9090b8" }}>
            LVL <span style={{ color: "#ffd54f", fontWeight: 700 }}>{Math.floor(progress.xp / XP_PER_LEVEL) + 1}</span>
          </div>
          <div style={{ width: 100, height: 4, background: "#1a1a30", borderRadius: 2 }}>
            <div style={{ width: `${(progress.xp % XP_PER_LEVEL / XP_PER_LEVEL) * 100}%`, height: "100%", background: "linear-gradient(90deg, #7c4dff, #c9b8ff)", borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 12, color: "#6060a0" }}>{progress.xp} XP</div>
        </div>
      )}

      {/* Option cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 480 }}>
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={opt.disabled ? undefined : opt.onClick}
            disabled={opt.disabled}
            style={{
              background: opt.disabled ? "rgba(255,255,255,0.01)" : `linear-gradient(135deg, ${opt.accent}10 0%, rgba(255,255,255,0.02) 100%)`,
              border: `1px solid ${opt.disabled ? "#1a1a2a" : opt.accent + "33"}`,
              borderRadius: 12,
              padding: "14px 18px",
              cursor: opt.disabled ? "default" : "pointer",
              textAlign: "left",
              color: opt.disabled ? "#2a2a40" : "#e8e8f0",
              opacity: opt.disabled ? 0.4 : 1,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 14,
              // stagger animation feel via transform on hover
            }}
            onMouseOver={e => { if (!opt.disabled) { e.currentTarget.style.background = `${opt.accent}18`; e.currentTarget.style.borderColor = `${opt.accent}66`; e.currentTarget.style.transform = "translateX(4px)"; } }}
            onMouseOut={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${opt.accent}10 0%, rgba(255,255,255,0.02) 100%)`; e.currentTarget.style.borderColor = `${opt.accent}33`; e.currentTarget.style.transform = ""; }}
          >
            {/* Left accent line */}
            <div style={{ width: 3, height: 36, borderRadius: 2, background: opt.disabled ? "#2a2a40" : opt.accent, flexShrink: 0 }} />

            {/* Text */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: opt.isSkill ? 500 : 600, color: opt.disabled ? "#2a2a40" : opt.accent }}>
                {opt.icon ? `${opt.icon}  ${opt.label}` : opt.label}
              </div>
            </div>

            {/* Arrow */}
            {!opt.disabled && <div style={{ fontSize: 16, color: opt.accent + "66", flexShrink: 0 }}>›</div>}
          </button>
        ))}
      </div>

      {/* Reset link */}
      {progress.xp > 0 && (
        <button onClick={onReset} style={{ marginTop: 28, background: "transparent", border: "none", color: "#2a2a40", cursor: "pointer", fontSize: 11 }}
          onMouseOver={e => e.currentTarget.style.color = "#ef5350"}
          onMouseOut={e => e.currentTarget.style.color = "#2a2a40"}>
          ↺ Reset all progress
        </button>
      )}
    </div>
  );
}

// ─── Full-page Character Sheet (from start menu) ───────────────────────────────
function FullPageSheet({ progress, level, onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a14 0%, #0f0f1f 60%, #0a1420 100%)", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#e8e8f0", padding: "28px 24px" }}>
      <button onClick={onBack} style={{ background: "transparent", border: "1px solid #2a2a40", color: "#6060a0", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}
        onMouseOver={e => { e.currentTarget.style.borderColor = "#c9b8ff"; e.currentTarget.style.color = "#c9b8ff"; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = "#2a2a40"; e.currentTarget.style.color = "#6060a0"; }}>
        ← Back to Guild Hall
      </button>
      <CharacterSheet skillScores={progress.skillScores} xp={progress.xp} level={level} history={progress.history} />
    </div>
  );
}

// ─── Full-page History (from start menu) ──────────────────────────────────────
function FullPageHistory({ progress, onReshuffle, onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a14 0%, #0f0f1f 60%, #0a1420 100%)", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#e8e8f0", padding: "28px 24px" }}>
      <button onClick={onBack} style={{ background: "transparent", border: "1px solid #2a2a40", color: "#6060a0", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}
        onMouseOver={e => { e.currentTarget.style.borderColor = "#c9b8ff"; e.currentTarget.style.color = "#c9b8ff"; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = "#2a2a40"; e.currentTarget.style.color = "#6060a0"; }}>
        ← Back to Guild Hall
      </button>
      <HistoryLog history={progress.history} onReshuffle={onReshuffle} retiredIds={progress.retiredIds} />
    </div>
  );
}

// ─── Quest Card ────────────────────────────────────────────────────────────────
function QuestCard({ quest, onComplete, onProgress, onDiscard, onDelete, celebrating, isRetired, inHand }) {
  const [bonusChecked, setBonusChecked] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { bg, accent, icon } = SKILL_COLORS[quest.skill] ?? { bg: "#1a1a2a", accent: "#9090c0", icon: "🎴" };
  const xpPreview = calcXP(quest.reward, bonusChecked && !!quest.bonus);

  return (
    <div style={{
      background: `linear-gradient(145deg, ${bg} 0%, #0d0d1a 100%)`,
      border: `1px solid ${celebrating ? accent : isRetired ? "#2a2a3a" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 16, padding: "17px 17px 13px", position: "relative", overflow: "hidden",
      opacity: isRetired ? 0.4 : 1, transition: "all 0.3s",
      boxShadow: celebrating ? `0 0 28px ${accent}55` : "none",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: celebrating ? 1 : 0.3 }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 9 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: accent, textTransform: "uppercase", opacity: 0.8 }}>{icon} {quest.skill}</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {inHand && <span style={{ fontSize: 9, color: "#4fc3f7", background: "rgba(79,195,247,0.1)", border: "1px solid rgba(79,195,247,0.2)", padding: "1px 5px", borderRadius: 8 }}>IN HAND</span>}
          <span style={{ fontSize: 9, fontWeight: 700, color: RESHUFFLE_COLOR[quest.reshuffle], background: RESHUFFLE_COLOR[quest.reshuffle] + "18", border: `1px solid ${RESHUFFLE_COLOR[quest.reshuffle]}33`, padding: "1px 6px", borderRadius: 8 }}>{RESHUFFLE_LABEL[quest.reshuffle]}</span>
        </div>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.25, color: isRetired ? "#404060" : "#e8e8f8", marginBottom: 7, textDecoration: isRetired ? "line-through" : "none" }}>
        {celebrating ? "✨ " : ""}{quest.name}
      </div>

      <div style={{ fontSize: 12, color: "#9090b8", lineHeight: 1.5, borderLeft: `2px solid ${accent}44`, paddingLeft: 9, marginBottom: 9 }}>{quest.task}</div>

      <div style={{ display: "flex", gap: 10, marginBottom: 9, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "#5050a0" }}>⏱ {quest.time}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: bonusChecked && quest.bonus ? "#ffd54f" : accent, transition: "color 0.2s" }}>+{xpPreview} XP{bonusChecked && quest.bonus ? " ⭐" : ""}</span>
      </div>

      {quest.bonus && !isRetired && (
        <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", marginBottom: 11, padding: "7px 9px", borderRadius: 8, background: bonusChecked ? "rgba(255,213,79,0.1)" : "rgba(255,213,79,0.03)", border: `1px solid ${bonusChecked ? "rgba(255,213,79,0.35)" : "rgba(255,213,79,0.1)"}`, transition: "all 0.2s" }}>
          <div style={{ width: 15, height: 15, borderRadius: 3, border: `2px solid ${bonusChecked ? "#ffd54f" : "rgba(255,213,79,0.3)"}`, background: bonusChecked ? "#ffd54f" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {bonusChecked && <span style={{ fontSize: 9, color: "#1a1a00", fontWeight: 900 }}>✓</span>}
          </div>
          <input type="checkbox" checked={bonusChecked} onChange={e => setBonusChecked(e.target.checked)} style={{ display: "none" }} />
          <span style={{ fontSize: 11, color: bonusChecked ? "#ffd54f" : "#807020", lineHeight: 1.3 }}>
            <span style={{ fontWeight: 600 }}>Bonus:</span> {quest.bonus}{bonusChecked && <span style={{ color: "#ffd54f" }}> → +50% XP!</span>}
          </span>
        </label>
      )}

      {!isRetired ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ display: "flex", gap: 5 }}>
            <button onClick={() => onComplete(bonusChecked)}
              title="Complete quest"
              style={{ flex: 1, background: `linear-gradient(135deg, ${accent}22, ${accent}11)`, border: `1px solid ${accent}44`, color: accent, borderRadius: 8, padding: "8px 0", cursor: "pointer", fontSize: 18 }}
              onMouseOver={e => e.currentTarget.style.background = `${accent}33`}
              onMouseOut={e => e.currentTarget.style.background = `linear-gradient(135deg, ${accent}22, ${accent}11)`}
            >✓</button>
            {onDiscard && (
              <button onClick={onDiscard}
                title="Swap for a new card"
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.07)", color: "#3a3a50", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 16 }}
                onMouseOver={e => { e.currentTarget.style.borderColor = "#ef5350"; e.currentTarget.style.color = "#ef5350"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#3a3a50"; }}>↺</button>
            )}
            {onDelete && !confirmDelete && (
              <button onClick={() => setConfirmDelete(true)}
                title="Delete quest permanently"
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.07)", color: "#3a3a50", borderRadius: 8, padding: "8px 10px", cursor: "pointer", fontSize: 14 }}
                onMouseOver={e => { e.currentTarget.style.borderColor = "#ef5350"; e.currentTarget.style.color = "#ef5350"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#3a3a50"; }}>🗑</button>
            )}
            {onDelete && confirmDelete && (
              <>
                <button onClick={() => { onDelete(); setConfirmDelete(false); }}
                  style={{ background: "#ef535022", border: "1px solid #ef535055", color: "#ef5350", borderRadius: 8, padding: "8px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>Del!</button>
                <button onClick={() => setConfirmDelete(false)}
                  style={{ background: "transparent", border: "1px solid #2a2a40", color: "#4040a0", borderRadius: 8, padding: "8px 8px", cursor: "pointer", fontSize: 11 }}>✕</button>
              </>
            )}
          </div>
          <button onClick={onProgress}
            title="Progress quest — earn 1 XP and reshuffle"
            style={{ width: "100%", background: "transparent", border: "1px solid rgba(255,255,255,0.07)", color: "#5050a0", borderRadius: 8, padding: "6px 0", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "#b39ddb"; e.currentTarget.style.color = "#b39ddb"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#5050a0"; }}>
            <span style={{ fontSize: 11, fontWeight: 600 }}>+1 XP</span><span>↺</span>
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center", fontSize: 11, color: "#404060", padding: "4px 0" }}>✓ One-time quest completed</div>
      )}
    </div>
  );
}

// ─── Character Sheet ───────────────────────────────────────────────────────────
function CharacterSheet({ skillScores, xp, level, history }) {
  const totalCompleted = history.filter(h => h.type === "complete").length;
  const totalBonuses = history.filter(h => h.bonusCompleted).length;
  const maxScore = Math.max(1, ...ALL_SKILLS.map(s => skillScores[s] ?? 0));

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: "#c9b8ff", marginBottom: 16 }}>⚔️ Adventurer's Dossier</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 26 }}>
        {[
          { label: "Level",           value: level,           color: "#ffd54f" },
          { label: "Total XP",        value: xp,              color: "#c9b8ff" },
          { label: "Quests Done",     value: totalCompleted,  color: "#66bb6a" },
          { label: "Bonuses Claimed", value: totalBonuses,    color: "#ffd54f" },
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 16px", textAlign: "center", minWidth: 80 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "#4040a0", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: "#4040a0", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Skill Scores</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {ALL_SKILLS.map(skill => {
          const score = skillScores[skill] ?? 0;
          const { accent, icon } = SKILL_COLORS[skill];
          return (
            <div key={skill} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 150, fontSize: 12, color: "#8080a0", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}><span>{icon}</span><span>{skill}</span></div>
              <div style={{ flex: 1, height: 7, background: "#1a1a2e", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${(score / (maxScore + 1)) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${accent}88, ${accent})`, borderRadius: 4, transition: "width 0.6s ease", minWidth: score > 0 ? 6 : 0 }} />
              </div>
              <div style={{ width: 24, textAlign: "right", fontSize: 13, fontWeight: 700, color: score > 0 ? accent : "#2a2a40" }}>{score}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Create Quest Form ────────────────────────────────────────────────────────
// ─── Create Hub ────────────────────────────────────────────────────────────────
function CreateHub({ onAddQuest, onAddLoot, onAddMilestone, allQuests }) {
  const [subTab, setSubTab] = useState("quest");
  const SUB_TABS = [
    { id: "quest",     label: "Quest" },
    { id: "loot",      label: "Loot" },
    { id: "milestone", label: "Milestone" },
  ];
  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: "#66bb6a", marginBottom: 16 }}>✦ Create</div>
      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 24 }}>
        {SUB_TABS.map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} style={{
            background: "transparent", border: "none",
            borderBottom: subTab === t.id ? "2px solid #66bb6a" : "2px solid transparent",
            color: subTab === t.id ? "#66bb6a" : "#4040a0",
            padding: "7px 18px", cursor: "pointer", fontSize: 13,
            fontWeight: subTab === t.id ? 600 : 400, transition: "color 0.2s",
          }}>{t.label}</button>
        ))}
      </div>
      {subTab === "quest"     && <CreateQuestForm     onSubmit={onAddQuest}     allQuests={allQuests} />}
      {subTab === "loot"      && <CreateLootForm       onSubmit={onAddLoot} />}
      {subTab === "milestone" && <CreateMilestoneForm  onSubmit={onAddMilestone} />}
    </div>
  );
}

const BLANK_QUEST_FORM = { name: "", task: "", time: "", bonus: "", reward: "", skill: "Focus", reshuffle: "weekly" };

function CreateQuestForm({ onSubmit, allQuests }) {
  const [form, setForm] = useState(BLANK_QUEST_FORM);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(""); };

  const handleSubmit = () => {
    if (!form.name.trim()) { setError("Card Name is required."); return; }
    if (!form.task.trim()) { setError("Task is required."); return; }
    if (!form.reward || isNaN(Number(form.reward)) || Number(form.reward) <= 0) { setError("Reward must be a positive number."); return; }
    const newQuest = {
      id: `custom_${Date.now()}`,
      name: form.name.trim(), task: form.task.trim(),
      time: form.time.trim() || "varies", bonus: form.bonus.trim() || null,
      reward: Number(form.reward), skill: form.skill, reshuffle: form.reshuffle, custom: true,
    };
    onSubmit(newQuest);
    setForm(BLANK_QUEST_FORM);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const inputStyle = {
    width: "100%", background: "#0d0d1a", border: "1px solid #2a2a40",
    borderRadius: 8, padding: "9px 12px", color: "#e8e8f0", fontSize: 13,
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  };
  const labelStyle = { fontSize: 11, color: "#6060a0", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5, display: "block" };

  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: "#66bb6a", marginBottom: 6 }}>✦ Create New Quest</div>
      <div style={{ fontSize: 12, color: "#4040a0", marginBottom: 24 }}>New quests are added directly to the deck.</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Card Name */}
        <div>
          <label style={labelStyle}>Card Name *</label>
          <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. The Lost Relic"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#66bb6a"}
            onBlur={e => e.target.style.borderColor = "#2a2a40"}
          />
        </div>

        {/* Task */}
        <div>
          <label style={labelStyle}>Task *</label>
          <textarea value={form.task} onChange={e => set("task", e.target.value)} placeholder="Describe what needs to be done…" rows={2}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
            onFocus={e => e.target.style.borderColor = "#66bb6a"}
            onBlur={e => e.target.style.borderColor = "#2a2a40"}
          />
        </div>

        {/* Skill + Reshuffle row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Skill</label>
            <select value={form.skill} onChange={e => set("skill", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={e => e.target.style.borderColor = "#66bb6a"}
              onBlur={e => e.target.style.borderColor = "#2a2a40"}
            >
              {ALL_SKILLS.map(s => <option key={s} value={s}>{SKILL_COLORS[s].icon} {s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Reshuffle</label>
            <select value={form.reshuffle} onChange={e => set("reshuffle", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={e => e.target.style.borderColor = "#66bb6a"}
              onBlur={e => e.target.style.borderColor = "#2a2a40"}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="no">One-time</option>
            </select>
          </div>
        </div>

        {/* Time + Reward row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Time Estimate</label>
            <input value={form.time} onChange={e => set("time", e.target.value)} placeholder="e.g. 30 minutes"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#66bb6a"}
              onBlur={e => e.target.style.borderColor = "#2a2a40"}
            />
          </div>
          <div>
            <label style={labelStyle}>XP Reward *</label>
            <input value={form.reward} onChange={e => set("reward", e.target.value)} placeholder="e.g. 6" type="number" min="1"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#66bb6a"}
              onBlur={e => e.target.style.borderColor = "#2a2a40"}
            />
          </div>
        </div>

        {/* Bonus */}
        <div>
          <label style={labelStyle}>Bonus Objective <span style={{ color: "#2a2a50", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
          <input value={form.bonus} onChange={e => set("bonus", e.target.value)} placeholder="Optional — earns +50% XP if completed"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#ffd54f"}
            onBlur={e => e.target.style.borderColor = "#2a2a40"}
          />
        </div>

        {/* Error */}
        {error && <div style={{ fontSize: 12, color: "#ef5350", background: "rgba(239,83,80,0.08)", border: "1px solid rgba(239,83,80,0.2)", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}

        {/* Submit */}
        <button onClick={handleSubmit} style={{
          background: submitted ? "rgba(102,187,106,0.2)" : "linear-gradient(135deg, rgba(102,187,106,0.15), rgba(102,187,106,0.08))",
          border: `1px solid ${submitted ? "#66bb6a" : "rgba(102,187,106,0.3)"}`,
          color: submitted ? "#66bb6a" : "#66bb6a", borderRadius: 10, padding: "11px 0",
          cursor: "pointer", fontSize: 14, fontWeight: 600, width: "100%", transition: "all 0.2s",
        }}
        onMouseOver={e => { if (!submitted) e.currentTarget.style.background = "rgba(102,187,106,0.22)"; }}
        onMouseOut={e => { if (!submitted) e.currentTarget.style.background = "linear-gradient(135deg, rgba(102,187,106,0.15), rgba(102,187,106,0.08))"; }}
        >
          {submitted ? "✓ Quest added to deck!" : "✦ Add Quest to Deck"}
        </button>
      </div>
    </div>
  );
}

// ─── Create Loot Form ──────────────────────────────────────────────────────────
const BLANK_LOOT_FORM = { name: "", description: "", rarity: "Common" };

function CreateLootForm({ onSubmit }) {
  const [form, setForm] = useState(BLANK_LOOT_FORM);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(""); };

  const handleSubmit = () => {
    if (!form.name.trim()) { setError("Reward name is required."); return; }
    if (!form.description.trim()) { setError("Description is required."); return; }
    onSubmit({ id: `loot_custom_${Date.now()}`, name: form.name.trim(), description: form.description.trim(), rarity: form.rarity });
    setForm(BLANK_LOOT_FORM);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const rs = RARITY_STYLES[form.rarity];
  const inputStyle = { width: "100%", background: "#0d0d1a", border: "1px solid #2a2a40", borderRadius: 8, padding: "9px 12px", color: "#e8e8f0", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const labelStyle = { fontSize: 11, color: "#6060a0", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5, display: "block" };

  return (
    <div>
      <div style={{ fontSize: 13, color: "#4040a0", marginBottom: 20 }}>Add a new reward to the loot table. It can be awarded by future milestones.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={labelStyle}>Reward Name *</label>
          <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Artisan Coffee"
            style={inputStyle} onFocus={e => e.target.style.borderColor = rs.color} onBlur={e => e.target.style.borderColor = "#2a2a40"} />
        </div>
        <div>
          <label style={labelStyle}>Description *</label>
          <textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="What does the player get to do?" rows={2}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} onFocus={e => e.target.style.borderColor = rs.color} onBlur={e => e.target.style.borderColor = "#2a2a40"} />
        </div>
        <div>
          <label style={labelStyle}>Rarity</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {["Common", "Uncommon", "Rare", "Legendary"].map(r => {
              const s = RARITY_STYLES[r];
              const sel = form.rarity === r;
              return (
                <button key={r} onClick={() => set("rarity", r)} style={{
                  background: sel ? `${s.color}22` : "transparent", border: `1px solid ${sel ? s.color : "#2a2a40"}`,
                  color: sel ? s.color : "#4040a0", borderRadius: 8, padding: "7px 0", cursor: "pointer", fontSize: 11, fontWeight: sel ? 700 : 400,
                }}>{s.icon} {r}</button>
              );
            })}
          </div>
        </div>
        {error && <div style={{ fontSize: 12, color: "#ef5350", background: "rgba(239,83,80,0.08)", border: "1px solid rgba(239,83,80,0.2)", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}
        <button onClick={handleSubmit} style={{
          background: submitted ? `${rs.color}22` : `linear-gradient(135deg, ${rs.color}18, ${rs.color}08)`,
          border: `1px solid ${submitted ? rs.color : rs.color + "44"}`,
          color: rs.color, borderRadius: 10, padding: "11px 0", cursor: "pointer", fontSize: 14, fontWeight: 600, width: "100%",
        }}>
          {submitted ? `✓ ${form.rarity} loot added!` : `✦ Add to Loot Table`}
        </button>
      </div>
    </div>
  );
}

// ─── Create Milestone Form ─────────────────────────────────────────────────────
const BLANK_MILESTONE_FORM = { name: "", type: "skill", skill: "Focus", threshold: "3", rarity: "Common" };

function CreateMilestoneForm({ onSubmit }) {
  const [form, setForm] = useState(BLANK_MILESTONE_FORM);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(""); };

  const handleSubmit = () => {
    if (!form.name.trim()) { setError("Milestone name is required."); return; }
    const threshold = Number(form.threshold);
    if (!threshold || threshold < 1) { setError("Threshold must be a positive number."); return; }
    onSubmit({
      id: `milestone_custom_${Date.now()}`,
      name: form.name.trim(), type: form.type,
      skill: form.type === "skill" ? form.skill : undefined,
      threshold, rarity: form.rarity,
    });
    setForm(BLANK_MILESTONE_FORM);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const rs = RARITY_STYLES[form.rarity];
  const inputStyle = { width: "100%", background: "#0d0d1a", border: "1px solid #2a2a40", borderRadius: 8, padding: "9px 12px", color: "#e8e8f0", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const labelStyle = { fontSize: 11, color: "#6060a0", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5, display: "block" };

  return (
    <div>
      <div style={{ fontSize: 13, color: "#4040a0", marginBottom: 20 }}>Create a new milestone. When the condition is met, a loot reward of the chosen rarity is awarded.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={labelStyle}>Milestone Name *</label>
          <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Shadow Step Master"
            style={inputStyle} onFocus={e => e.target.style.borderColor = "#c9b8ff"} onBlur={e => e.target.style.borderColor = "#2a2a40"} />
        </div>
        <div>
          <label style={labelStyle}>Trigger Type</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[{ id: "skill", label: "Skill Score" }, { id: "level", label: "Player Level" }].map(t => (
              <button key={t.id} onClick={() => set("type", t.id)} style={{
                background: form.type === t.id ? "rgba(201,184,255,0.15)" : "transparent",
                border: `1px solid ${form.type === t.id ? "#c9b8ff" : "#2a2a40"}`,
                color: form.type === t.id ? "#c9b8ff" : "#4040a0",
                borderRadius: 8, padding: "8px 0", cursor: "pointer", fontSize: 12, fontWeight: form.type === t.id ? 600 : 400,
              }}>{t.label}</button>
            ))}
          </div>
        </div>
        {form.type === "skill" && (
          <div>
            <label style={labelStyle}>Skill</label>
            <select value={form.skill} onChange={e => set("skill", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }} onFocus={e => e.target.style.borderColor = "#c9b8ff"} onBlur={e => e.target.style.borderColor = "#2a2a40"}>
              {ALL_SKILLS.map(s => <option key={s} value={s}>{SKILL_COLORS[s].icon} {s}</option>)}
            </select>
          </div>
        )}
        <div>
          <label style={labelStyle}>{form.type === "level" ? "Level Threshold" : "Score Threshold"} *</label>
          <input value={form.threshold} onChange={e => set("threshold", e.target.value)} placeholder="e.g. 5" type="number" min="1"
            style={inputStyle} onFocus={e => e.target.style.borderColor = "#c9b8ff"} onBlur={e => e.target.style.borderColor = "#2a2a40"} />
        </div>
        <div>
          <label style={labelStyle}>Loot Rarity Awarded</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {["Common", "Uncommon", "Rare", "Legendary"].map(r => {
              const s = RARITY_STYLES[r]; const sel = form.rarity === r;
              return (
                <button key={r} onClick={() => set("rarity", r)} style={{
                  background: sel ? `${s.color}22` : "transparent", border: `1px solid ${sel ? s.color : "#2a2a40"}`,
                  color: sel ? s.color : "#4040a0", borderRadius: 8, padding: "7px 0", cursor: "pointer", fontSize: 11, fontWeight: sel ? 700 : 400,
                }}>{s.icon} {r}</button>
              );
            })}
          </div>
        </div>
        {error && <div style={{ fontSize: 12, color: "#ef5350", background: "rgba(239,83,80,0.08)", border: "1px solid rgba(239,83,80,0.2)", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}
        <button onClick={handleSubmit} style={{
          background: submitted ? "rgba(201,184,255,0.2)" : "linear-gradient(135deg, rgba(201,184,255,0.12), rgba(201,184,255,0.05))",
          border: `1px solid ${submitted ? "#c9b8ff" : "rgba(201,184,255,0.3)"}`,
          color: "#c9b8ff", borderRadius: 10, padding: "11px 0", cursor: "pointer", fontSize: 14, fontWeight: 600, width: "100%",
        }}>
          {submitted ? "✓ Milestone created!" : "✦ Add Milestone"}
        </button>
      </div>
    </div>
  );
}

// ─── History Log ───────────────────────────────────────────────────────────────
function HistoryLog({ history, onReshuffle, retiredIds }) {
  if (history.length === 0) return (
    <div style={{ color: "#3030a0", fontSize: 14, textAlign: "center", paddingTop: 60 }}>No quests completed yet. Get out there, adventurer.</div>
  );

  return (
    <div style={{ maxWidth: 660 }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: "#c9b8ff", marginBottom: 16 }}>📖 Quest History</div>
      <div style={{ fontSize: 11, color: "#4040a0", marginBottom: 14 }}>{history.length} entries</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {history.map((entry, i) => {
          const { accent, icon } = SKILL_COLORS[entry.skill] ?? { accent: "#9090c0", icon: "🎴" };
          const quest = QUESTS.find(q => q.id === entry.questId);
          const canReshuffle = entry.type === "complete" && quest && quest.reshuffle !== "no" && !retiredIds.includes(entry.questId);
          const date = new Date(entry.timestamp);
          const dateStr = date.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " " + date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderLeft: `3px solid ${entry.type === "progress" ? "#3a3a60" : accent}`, borderRadius: 10, padding: "9px 12px" }}>
              <div style={{ fontSize: 16, flexShrink: 0 }}>{icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#b0b0c8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {entry.name}{entry.bonusCompleted && <span style={{ marginLeft: 6, fontSize: 10, color: "#ffd54f" }}>⭐ bonus</span>}
                </div>
                <div style={{ fontSize: 10, color: "#404060", marginTop: 1 }}>{entry.type === "progress" ? "progressed" : "completed"} · {dateStr}</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: accent, flexShrink: 0 }}>+{entry.xpEarned} XP</div>
              {canReshuffle && (
                <button onClick={() => onReshuffle(entry.questId)} style={{ background: "transparent", border: "1px solid #2a2a50", color: "#4a4a70", borderRadius: 6, padding: "3px 7px", cursor: "pointer", fontSize: 10, flexShrink: 0 }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "#c9b8ff"; e.currentTarget.style.color = "#c9b8ff"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "#2a2a50"; e.currentTarget.style.color = "#4a4a70"; }}>
                  ↺ reshuffle
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Milestones Tab ────────────────────────────────────────────────────────────
function MilestonesTab({ earnedMilestones, skillScores, level, customMilestones = [] }) {
  const allMilestones = [...MILESTONES, ...customMilestones];
  const levelMilestones = allMilestones.filter(m => m.type === "level");
  const skillGroups = ALL_SKILLS.map(skill => ({
    skill,
    milestones: allMilestones.filter(m => m.type === "skill" && m.skill === skill),
  }));

  const MilestoneRow = ({ m }) => {
    const earned = earnedMilestones.includes(m.id);
    const rs = RARITY_STYLES[m.rarity];
    const current = m.type === "level" ? level : (skillScores[m.skill] ?? 0);
    const pct = Math.min(100, (current / m.threshold) * 100);
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        background: earned ? `${rs.glow}` : "rgba(255,255,255,0.02)",
        border: `1px solid ${earned ? rs.color + "55" : "#1e1e30"}`,
        borderRadius: 10, padding: "10px 14px",
        opacity: earned ? 1 : 0.65,
      }}>
        <div style={{ fontSize: 18, flexShrink: 0 }}>{earned ? "🏆" : "○"}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: earned ? rs.color : "#6060a0" }}>{m.name}</span>
            <span style={{ fontSize: 10, color: rs.color, background: rs.color + "18", border: `1px solid ${rs.color}33`, padding: "1px 6px", borderRadius: 8, fontWeight: 700 }}>{rs.icon} {m.rarity}</span>
          </div>
          {!earned && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 4, background: "#1a1a2e", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${rs.color}66, ${rs.color})`, borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 10, color: "#4040a0", flexShrink: 0 }}>{current}/{m.threshold}</span>
            </div>
          )}
        </div>
        {earned && <div style={{ fontSize: 11, color: rs.color, fontWeight: 700, flexShrink: 0 }}>Earned!</div>}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: "#c9b8ff", marginBottom: 4 }}>🏆 Milestones</div>
      <div style={{ fontSize: 11, color: "#4040a0", marginBottom: 20 }}>{earnedMilestones.length} of {allMilestones.length} earned</div>

      <div style={{ fontSize: 11, color: "#5050a0", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Adventurer</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
        {levelMilestones.map(m => <MilestoneRow key={m.id} m={m} />)}
      </div>

      {skillGroups.map(({ skill, milestones }) => {
        const { accent, icon } = SKILL_COLORS[skill];
        return (
          <div key={skill} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: accent, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{icon} {skill}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {milestones.map(m => <MilestoneRow key={m.id} m={m} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Inventory Tab ─────────────────────────────────────────────────────────────
function InventoryTab({ inventory, onUse }) {
  const [confirmId, setConfirmId] = useState(null);

  if (inventory.length === 0) return (
    <div style={{ color: "#3030a0", fontSize: 14, textAlign: "center", paddingTop: 60 }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🎒</div>
      Your inventory is empty. Earn milestones to receive loot!
    </div>
  );

  const byRarity = ["Legendary", "Rare", "Uncommon", "Common"];
  const grouped = byRarity.map(r => ({ rarity: r, items: inventory.filter(i => i.rarity === r) })).filter(g => g.items.length > 0);

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: "#c9b8ff", marginBottom: 4 }}>🎒 Inventory</div>
      <div style={{ fontSize: 11, color: "#4040a0", marginBottom: 20 }}>{inventory.length} item{inventory.length !== 1 ? "s" : ""} in your pack</div>

      {grouped.map(({ rarity, items }) => {
        const rs = RARITY_STYLES[rarity];
        return (
          <div key={rarity} style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, color: rs.color, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{rs.icon} {rarity}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map(item => (
                <div key={item.instanceId} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  background: `linear-gradient(135deg, ${rs.color}08, rgba(255,255,255,0.02))`,
                  border: `1px solid ${rs.color}30`,
                  borderRadius: 12, padding: "12px 16px",
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: rs.color, marginBottom: 3 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#7070a0", lineHeight: 1.4 }}>{item.description}</div>
                  </div>
                  {confirmId === item.instanceId ? (
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => { onUse(item.instanceId); setConfirmId(null); }} style={{ background: "#ef535022", border: "1px solid #ef535055", color: "#ef5350", borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Use it!</button>
                      <button onClick={() => setConfirmId(null)} style={{ background: "transparent", border: "1px solid #2a2a40", color: "#4040a0", borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 12 }}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmId(item.instanceId)} style={{
                      background: "transparent", border: `1px solid ${rs.color}44`,
                      color: rs.color, borderRadius: 8, padding: "6px 14px",
                      cursor: "pointer", fontSize: 12, fontWeight: 600, flexShrink: 0,
                    }}
                    onMouseOver={e => e.currentTarget.style.background = `${rs.color}18`}
                    onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                      Use
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Loot Modal ────────────────────────────────────────────────────────────────
function LootModal({ data, onClose }) {
  const { milestone, loot } = data;
  const rs = RARITY_STYLES[loot.rarity];
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "linear-gradient(145deg, #0f0f20, #14141f)",
        border: `1px solid ${rs.color}55`,
        borderRadius: 20, padding: "36px 32px", maxWidth: 420, width: "100%", textAlign: "center",
        boxShadow: `0 0 60px ${rs.glow}`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${rs.color}, transparent)` }} />
        <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
        <div style={{ fontSize: 12, color: "#6060a0", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Milestone Reached</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#e8e8f8", marginBottom: 20 }}>{milestone.name}</div>
        <div style={{ width: 40, height: 1, background: "#2a2a40", margin: "0 auto 20px" }} />
        <div style={{ fontSize: 12, color: "#5050a0", marginBottom: 8 }}>You received</div>
        <div style={{ fontSize: 11, color: rs.color, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>{rs.icon} {loot.rarity} Loot</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: rs.color, marginBottom: 8, textShadow: `0 0 20px ${rs.color}88` }}>{loot.name}</div>
        <div style={{ fontSize: 13, color: "#7070a0", lineHeight: 1.5, marginBottom: 28 }}>{loot.description}</div>
        <button onClick={onClose} style={{
          background: `linear-gradient(135deg, ${rs.color}22, ${rs.color}11)`,
          border: `1px solid ${rs.color}55`, color: rs.color,
          borderRadius: 10, padding: "10px 32px", cursor: "pointer", fontSize: 14, fontWeight: 700,
        }}
        onMouseOver={e => e.currentTarget.style.background = `${rs.color}33`}
        onMouseOut={e => e.currentTarget.style.background = `linear-gradient(135deg, ${rs.color}22, ${rs.color}11)`}>
          Claim & Continue
        </button>
        <div style={{ fontSize: 10, color: "#3030a0", marginTop: 12 }}>Added to your inventory</div>
      </div>
    </div>
  );
}
