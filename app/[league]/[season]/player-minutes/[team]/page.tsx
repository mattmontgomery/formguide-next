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
import clsx from "clsx";
import { cache } from "react";
import PlayerMinutesTable from "./Table";

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
  const emptyFixtures = fixtures
    .filter((fixture) => fixture.fixture.status.long === "Match Finished")
    .reduce((acc, fixture) => ({ ...acc, [fixture.fixture.id]: null }), {});

  const { players, playerStats } = lineupsByFixture.reduce(
    (acc, { fixture, teamData }) => {
      teamData[0].players.forEach((player) => {
        if (!acc.playerStats[player.player.id]) {
          acc.playerStats[player.player.id] = { ...emptyFixtures };
        }
        if (!acc.players[player.player.id]) {
          acc.players[player.player.id] = player.player.name;
        }
        acc.playerStats[player.player.id][fixture] = player;
      });
      return acc;
    },
    {
      players: {} as Record<string, string>,
      playerStats: {} as Record<string, Record<string, PlayerStatistics>>,
    }
  );

  return (
    <div>
      <div>
        <PlayerMinutesTable players={players} playerStats={playerStats} />
      </div>
    </div>
  );
}
