import { Statistics } from "./api-football/lineups";

export function getRollingTotal(
  stats: Record<string, number[]>,
  periodLength: number = 5
): Record<string, number[]> {
  const rollingTotals: Record<string, number[]> = {};

  Object.keys(stats).forEach((key) => {
    const stat = stats[key];
    const rollingTotal: number[] = [];

    for (let i = 0; i <= stat.length - periodLength; i++) {
      const rollingStatistic = stat
        .slice(i, i + periodLength)
        .reduce((sum, min) => sum + min, 0);
      rollingTotal.push(rollingStatistic);
    }

    rollingTotals[key] = rollingTotal;
  });

  return rollingTotals;
}

export const getters = {
  minutes: (statistic: Statistics) => statistic?.games.minutes ?? 0,
  goals: (statistic: Statistics) => statistic?.goals.total ?? 0,
  passes: (statistic: Statistics) => statistic?.passes.total ?? 0,
  assists: (statistic: Statistics) => statistic?.goals.assists ?? 0,
  goals_assists: (statistic: Statistics) =>
    (statistic?.goals.total ?? 0) + (statistic?.goals.assists ?? 0),
  shots: (statistic: Statistics) => statistic?.shots.total ?? 0,
  shotsOnTarget: (statistic: Statistics) => statistic?.shots.on ?? 0,
  shotsOffTarget: (statistic: Statistics) =>
    (statistic?.shots.total ?? 0) - (statistic?.shots.on ?? 0) ?? 0,
  fouls: (statistic: Statistics) => statistic?.fouls.committed ?? 0,
  fouls_suffered: (statistic: Statistics) => statistic?.fouls.drawn ?? 0,
  yellowCards: (statistic: Statistics) => statistic?.cards.yellow ?? 0,
  redCards: (statistic: Statistics) => statistic?.cards.red ?? 0,
  saves: (statistic: Statistics) => statistic?.goals.saves ?? 0,
  offsides: (statistic: Statistics) => statistic?.offsides ?? 0,
};

export const max: Record<keyof typeof getters, number> = {
  minutes: 95,
  goals: 1,
  assists: 1,
  goals_assists: 2,
  passes: 100,
  shots: 6,
  shotsOnTarget: 3,
  shotsOffTarget: 3,
  fouls: 3,
  fouls_suffered: 3,
  yellowCards: 0.7,
  redCards: 0.3,
  saves: 5,
  offsides: 2,
};
export const displayNames: Record<keyof typeof getters, string> = {
  minutes: "Minutes Played",
  goals: "Goals",
  assists: "Assists",
  goals_assists: "Goals + Assists",
  passes: "Passes",
  shots: "Shots",
  shotsOnTarget: "Shots on Target",
  shotsOffTarget: "Shots off Target",
  fouls: "Fouls Committed",
  fouls_suffered: "Fouls Suffered",
  yellowCards: "Yellow Cards",
  redCards: "Red Cards",
  saves: "Saves",
  offsides: "Offsides",
};
