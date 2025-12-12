export const mockRankingAndStatistics = [
  { username: "Alice", score: 4, color: "#ffc607" },
  { username: "Bob", score: 3, color: "#57cbff" },
  { username: "Charlie", score: 2, color: "#ff0100" },
  { username: "Catalina", score: 1, color: "#29db00"}
];

export const mockPlayers = [
  {
    username: "Alice",
    isPlaying: true,
    index: 0,
    hasRolledThisTurn: false,
    score: 4,
    color: "#ffc607",

    numberOfRoundWithoutPlaying: 5,
    numberOfPawnEaten: 4,
    numberOfTimeOfGettingEaten: 0,
    numberOfSix: 36,
    averageDice: 5.511111111111111,
    averageMove: 5.45,
  },
  {
    username: "Bob",
    isPlaying: false,
    index: 1,
    hasRolledThisTurn: false,
    score: 1,
    color: "#57cbff",

    numberOfRoundWithoutPlaying: 2,
    numberOfPawnEaten: 3,
    numberOfTimeOfGettingEaten: 1,
    numberOfSix: 8,
    averageDice: 4.823529411764706,
    averageMove: 5.133333333333334,
  },
  {
    username: "Faysal",
    isPlaying: false,
    index: 2,
    hasRolledThisTurn: false,
    score: 1,
    color: "#29db00",

    numberOfRoundWithoutPlaying: 3,
    numberOfPawnEaten: 1,
    numberOfTimeOfGettingEaten: 4,
    numberOfSix: 8,
    averageDice: 5.0588235294117645,
    averageMove: 5.428571428571429,
  },
  {
    username: "lala",
    isPlaying: false,
    index: 3,
    hasRolledThisTurn: false,
    score: 0,
    color: "#ff0100",

    numberOfRoundWithoutPlaying: 4,
    numberOfPawnEaten: 0,
    numberOfTimeOfGettingEaten: 3,
    numberOfSix: 7,
    averageDice: 4.5,
    averageMove: 5.166666666666667,
  },
];
