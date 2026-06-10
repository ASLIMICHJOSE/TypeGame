// Badge definitions

const badges = [
  {
    id: 'first_fire',
    name: 'First Fire',
    icon: '🔥',
    description: 'Complete your first game',
    check: (stats) => stats.gamesPlayed >= 1
  },
  {
    id: 'spark',
    name: 'Spark',
    icon: '✨',
    description: 'Reach 30 WPM',
    check: (stats) => stats.bestWpm >= 30
  },
  {
    id: 'windrunner',
    name: 'Windrunner',
    icon: '💨',
    description: 'Reach 50 WPM',
    check: (stats) => stats.bestWpm >= 50
  },
  {
    id: 'stormcaller',
    name: 'Stormcaller',
    icon: '⚡',
    description: 'Reach 70 WPM',
    check: (stats) => stats.bestWpm >= 70
  },
  {
    id: 'blazelord',
    name: 'Blazelord',
    icon: '🔥',
    description: 'Reach 90 WPM',
    check: (stats) => stats.bestWpm >= 90
  },
  {
    id: 'typeking',
    name: 'Typeking',
    icon: '👑',
    description: 'Reach 120 WPM',
    check: (stats) => stats.bestWpm >= 120
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    icon: '🎯',
    description: '100% accuracy in a game',
    check: (stats) => stats.bestAccuracy >= 100
  },
  {
    id: 'chainmaster',
    name: 'Chainmaster',
    icon: '🔗',
    description: 'Reach 20 combo',
    check: (stats) => stats.bestCombo >= 20
  },
  {
    id: 'unbreakable',
    name: 'Unbreakable',
    icon: '🛡️',
    description: 'Hit a 50-combo',
    check: (stats) => stats.bestCombo >= 50
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    icon: '📅',
    description: 'Play 10 games',
    check: (stats) => stats.gamesPlayed >= 10
  },
  {
    id: 'champion',
    name: 'Champion',
    icon: '🏆',
    description: 'Play 25 games',
    check: (stats) => stats.gamesPlayed >= 25
  },
  {
    id: 'inferno_run',
    name: 'Inferno Run',
    icon: '💀',
    description: 'Complete the Inferno level',
    check: (stats) => stats.levelsCompleted?.includes('inferno')
  }
];

export default badges;
