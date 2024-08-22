"use client";

import { GenericChart } from "@/components/charts/Generic";
import { RadioInput } from "@/components/Form/Radio";
import { Fixture } from "@/services/api-football/fixtures";
import { fetchLineups, Statistics } from "@/services/api-football/lineups";
import { getRollingTotal } from "@/services/stats";
import { useMemo, useState } from "react";

const getters = {
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
  yellowCards: (statistic: Statistics) => statistic?.cards.yellow ?? 0,
  redCards: (statistic: Statistics) => statistic?.cards.red ?? 0,
  saves: (statistic: Statistics) => statistic?.goals.saves ?? 0,
  offsides: (statistic: Statistics) => statistic?.offsides ?? 0,
};

const max: Record<keyof typeof getters, number> = {
  minutes: 95,
  goals: 1.5,
  assists: 1,
  goals_assists: 2,
  passes: 100,
  shots: 6,
  shotsOnTarget: 5,
  shotsOffTarget: 5,
  fouls: 5,
  yellowCards: 1,
  redCards: 1,
  saves: 5,
  offsides: 2,
};
const displayNames: Record<keyof typeof getters, string> = {
  minutes: "Minutes Played",
  goals: "Goals",
  assists: "Assists",
  goals_assists: "Goals + Assists",
  passes: "Passes",
  shots: "Shots",
  shotsOnTarget: "Shots on Target",
  shotsOffTarget: "Shots off Target",
  fouls: "Fouls Committed",
  yellowCards: "Yellow Cards",
  redCards: "Red Cards",
  saves: "Saves",
  offsides: "Offsides",
};

export default function Chart({
  fixtures,
  lineupsByFixture,
}: {
  fixtures: Fixture[];
  lineupsByFixture: {
    fixture: number;
    teamData: Awaited<ReturnType<typeof fetchLineups>>;
  }[];
}) {
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [statistic, setStatistic] = useState<keyof typeof getters>("minutes");

  const { players } = useMemo(() => {
    return lineupsByFixture.reduce(
      (acc, { teamData }) => {
        teamData[0].players.forEach((player) => {
          if (!acc.players[player.player.id]) {
            acc.players[player.player.id] = player.player.name;
          }
        });
        return acc;
      },
      {
        players: {} as Record<string, string>,
      }
    );
  }, [lineupsByFixture]);
  const emptyFixtures = fixtures
    .filter((fixture) => fixture.fixture.status.long === "Match Finished")
    .reduce((acc, fixture) => ({ ...acc, [fixture.fixture.id]: null }), {});
  const playerStats = useMemo(
    () =>
      lineupsByFixture.reduce((acc, { fixture, teamData }) => {
        teamData[0].players.forEach((player) => {
          console.log(player.statistics[0]);
          acc.push({
            fixture,
            player: player.player.id,
            stat: getters[statistic](player.statistics[0]),
          });
        });
        return acc;
      }, [] as { fixture: number; player: number; stat: number }[]),
    [lineupsByFixture, statistic]
  );

  const playerStatsByPlayer = playerStats.reduce(
    (acc, { fixture, player, stat }) => {
      if (!acc[player]) {
        acc[player] = { ...emptyFixtures };
      }
      acc[player][fixture] = stat;
      return acc;
    },
    {} as Record<string, Record<string, number>>
  );
  const playerStatsAsArray = Object.entries(playerStatsByPlayer)
    .map(([player, stats]) => ({
      [player]: Object.values(stats).map((stat) => stat ?? 0),
    }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});
  const rollingTotals = useMemo(
    () => getRollingTotal(playerStatsAsArray, Number(periodLength)),
    [playerStatsAsArray, periodLength]
  );
  return (
    <div>
      <form
        className="flex gap-x-2"
        onChange={(ev) => {
          setPeriodLength(Number(ev.currentTarget.rolling.value));
        }}
      >
        <RadioInput name="rolling" label="3 games" value={3} />
        <RadioInput name="rolling" label="5 games" value={5} defaultChecked />
        <RadioInput name="rolling" label="8 games" value={8} />
        <RadioInput name="rolling" label="11 games" value={11} />
      </form>
      <form
        className="columns-4"
        onChange={(ev) => {
          setStatistic(ev.currentTarget.statistic.value);
        }}
      >
        {Object.entries(displayNames).map(([value, label], index) => (
          <RadioInput
            key={value}
            name="statistic"
            label={label}
            value={value}
            defaultChecked={index === 0}
          />
        ))}
      </form>
      <table className="text-sm table w-full">
        <tbody>
          {Object.entries(players)
            .sort((a, b) =>
              a[1]
                .split(" ")
                .reverse()[0]
                .localeCompare(b[1].split(" ").reverse()[0])
            )
            .map(([id, player]) => (
              <tr key={id}>
                <td className="text-right pr-4">{player}</td>
                <td className="table-cell">
                  <div className="h-16 py-2 mb-1">
                    <GenericChart
                      maxValue={max[statistic] * periodLength}
                      periodLength={periodLength}
                      values={rollingTotals[id]}
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
