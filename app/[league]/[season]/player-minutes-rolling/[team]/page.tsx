import { GenericChart } from "@/components/charts/Generic";
import {
  Cell,
  EmptyFixtureCell,
  FixtureCell,
  GenericFixtureCell,
} from "@/components/Fixture";
import { fetchFixtures, Fixture } from "@/services/api-football/fixtures";
import {
  fetchLineups,
  Player,
  PlayerStatistics,
  Statistics,
} from "@/services/api-football/lineups";
import { getRollingTotal } from "@/services/stats";
import clsx from "clsx";
import { cache } from "react";

const fetchFixtures_cached = cache(fetchFixtures);

async function fetchLineupsByFixture(
  teamId: string,
  fixtures: Fixture[]
): Promise<
  {
    fixture: number;
    teamData: Awaited<ReturnType<typeof fetchLineups>>;
  }[]
> {
  return await Promise.all(
    fixtures.map(async (fixture) => {
      return {
        fixture: fixture.fixture.id,
        teamData: await fetchLineups({
          team: teamId,
          fixture: fixture.fixture.id,
        }),
      };
    })
  );
}

const fetchLineupsByFixture_cached = cache(fetchLineupsByFixture);

export default async function PlayerMinutesPage(props: {
  params: {
    league: string;
    season: string;
    team: string;
  };
}) {
  const fixtures = await fetchFixtures_cached({
    league: props.params.league,
    season: props.params.season,
    team: props.params.team,
  });

  const lineupsByFixture = await fetchLineupsByFixture_cached(
    props.params.team,
    fixtures.filter(
      (fixture) => fixture.fixture.status.long === "Match Finished"
    )
  );

  const { players } = lineupsByFixture.reduce(
    (acc, { fixture, teamData }) => {
      teamData[0].players.forEach((player) => {
        if (!acc.playerStats[player.player.id]) {
          acc.playerStats[player.player.id] = [];
        }
        if (!acc.players[player.player.id]) {
          acc.players[player.player.id] = player.player.name;
        }
        acc.playerStats[player.player.id].push(
          player.statistics[0].games.minutes ?? 0
        );
      });
      return acc;
    },
    {
      players: {} as Record<string, string>,
      playerStats: {} as Record<string, number[]>,
    }
  );
  const emptyFixtures = fixtures
    .filter((fixture) => fixture.fixture.status.long === "Match Finished")
    .reduce((acc, fixture) => ({ ...acc, [fixture.fixture.id]: null }), {});
  // const emptyPlayerStats = Object.keys(players).reduce((acc, curr) => {...acc, [curr]: []});
  const emptyPlayerStats = Object.keys(players).reduce(
    (acc, player) => ({
      ...acc,
      [player]: emptyFixtures,
    }),
    {} as Record<string, Record<string, number>>
  );
  const playerStats = lineupsByFixture.reduce((acc, { fixture, teamData }) => {
    teamData[0].players.forEach((player) => {
      // if (!acc[player.player.id]) {
      //   acc[player.player.id] = { ...emptyFixtures };
      // }
      // acc[player.player.id][fixture] = player.statistics[0].games.minutes ?? 0;
      acc.push({
        fixture,
        player: player.player.id,
        stat: player.statistics[0].games.minutes ?? 0,
      });
    });
    return acc;
  }, [] as { fixture: number; player: number; stat: number }[]);

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

  const rollingTotals = getRollingTotal(playerStatsAsArray, 5);

  return (
    <div>
      <div>
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
                    <div className="h-16 py-2 mb-4">
                      <GenericChart
                        maxValue={100 * 5}
                        periodLength={5}
                        values={rollingTotals[id]}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
