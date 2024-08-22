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
