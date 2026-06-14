// Badge definitions

const badges = [
  {
    id: 'first_fire',
    name: 'First Fire',
    iconName: 'Flame',
    description: 'Complete your first game',
    check: (stats) => stats.gamesPlayed >= 1
  },
  {
    id: 'spark',
    name: 'Spark',
    iconName: 'Sparkles',
    description: 'Reach 30 WPM',
    check: (stats) => stats.bestWpm >= 30
  },
  {
    id: 'windrunner',
    name: 'Windrunner',
    iconName: 'Wind',
    description: 'Reach 50 WPM',
    check: (stats) => stats.bestWpm >= 50
  },
  {
    id: 'stormcaller',
    name: 'Stormcaller',
    iconName: 'Zap',
    description: 'Reach 70 WPM',
    check: (stats) => stats.bestWpm >= 70
  },
  {
    id: 'blazelord',
    name: 'Blazelord',
    iconName: 'Flame',
    description: 'Reach 90 WPM',
    check: (stats) => stats.bestWpm >= 90
  },
  {
    id: 'typeking',
    name: 'Typeking',
    iconName: 'Crown',
    description: 'Reach 120 WPM',
    check: (stats) => stats.bestWpm >= 120
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    iconName: 'Crosshair',
    description: '100% accuracy in a game',
    check: (stats) => stats.bestAccuracy >= 100
  },
  {
    id: 'chainmaster',
    name: 'Chainmaster',
    iconName: 'Link2',
    description: 'Reach 20 combo',
    check: (stats) => stats.bestCombo >= 20
  },
  {
    id: 'unbreakable',
    name: 'Unbreakable',
    iconName: 'ShieldCheck',
    description: 'Hit a 50-combo',
    check: (stats) => stats.bestCombo >= 50
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    iconName: 'CalendarCheck',
    description: 'Play 10 games',
    check: (stats) => stats.gamesPlayed >= 10
  },
  {
    id: 'champion',
    name: 'Champion',
    iconName: 'Trophy',
    description: 'Play 25 games',
    check: (stats) => stats.gamesPlayed >= 25
  },
  {
    id: 'inferno_run',
    name: 'Inferno Run',
    iconName: 'Skull',
    description: 'Complete the Inferno level',
    check: (stats) => stats.levelsCompleted?.includes('inferno')
  }
];

export default badges;
