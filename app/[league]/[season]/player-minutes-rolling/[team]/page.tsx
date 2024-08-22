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

  return (
    <div>
      <div>
        <Chart fixtures={fixtures} lineupsByFixture={lineupsByFixture} />
      </div>
    </div>
  );
}
