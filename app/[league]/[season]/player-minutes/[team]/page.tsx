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
      console.log(fixture);
      // console.log(fixtureId, fixture[0]);
      teamData[0].players.forEach((player) => {
        if (!acc.playerStats[player.player.id]) {
          acc.playerStats[player.player.id] = { ...emptyFixtures };
        }
        if (!acc.players[player.player.id]) {
          acc.players[player.player.id] = player.player.name;
        }
        console.log(player);
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
        <table className="text-sm">
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
                  {Object.values(playerStats[id]).map((stats, idx) =>
                    stats?.statistics[0].games.minutes ? (
                      <GenericFixtureCell
                        className={clsx({
                          "bg-amber-300": stats?.statistics[0].games.substitute,
                          "font-bold": stats?.statistics[0].games.minutes >= 70,
                          "font-normal":
                            stats?.statistics[0].games.minutes < 70,
                        })}
                        key={idx}
                      >
                        {stats?.statistics[0].games.minutes}
                      </GenericFixtureCell>
                    ) : (
                      <EmptyFixtureCell key={idx} />
                    )
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
