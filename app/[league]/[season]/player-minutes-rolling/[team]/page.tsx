import {} from "@/components/Fixture";
import { fetchFixtures, Fixture } from "@/services/api-football/fixtures";
import { fetchLineups } from "@/services/api-football/lineups";
import { cache } from "react";
import Chart from "./Chart";

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
    (acc, { teamData }) => {
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
  const playerStats = lineupsByFixture.reduce((acc, { fixture, teamData }) => {
    teamData[0].players.forEach((player) => {
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

  return (
    <div>
      <div>
        <Chart playerStatsAsArray={playerStatsAsArray} players={players} />
      </div>
    </div>
  );
}
