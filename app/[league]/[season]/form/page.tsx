import { cache } from "react";
import {
  convertFixturesToTeamMap,
  fetchFixturesForLeagueAndSeason,
  type Fixture,
} from "@/services/api-football/fixtures";
import {
  CACHED_LEAGUES,
  CACHED_YEARS,
  LEAGUES,
} from "@/services/api-football/constants";
import { EmptyFixtureCell, FixtureCell } from "@/components/Fixture";
import { Title } from "@/components/Title";

const cached_fetchFixturesForLeagueAndSeason = cache(
  fetchFixturesForLeagueAndSeason
);

export default async function FormPage({
  params,
}: {
  params: { league: string; season: string };
}) {
  const fixtures = await cached_fetchFixturesForLeagueAndSeason(
    params.league as keyof typeof LEAGUES,
    params.season
  );
  const fixturesByTeam = convertFixturesToTeamMap(fixtures);
  return (
    <div className="grid grid-flow-row gap-y-4">
      <Title>Form Guide</Title>
      <table className="table border-collapse gap-y-2 text-sm">
        <tbody>
          {Object.keys(fixturesByTeam)
            .sort()
            .map((team) => (
              <tr key={team} className="table-row text-2xs">
                <td className="table-cell text-right pr-2 align-middle">
                  {team}
                </td>

                {fixturesByTeam[team].map((fixture, idx) =>
                  fixture.fixture.status?.long === "Match Finished" ? (
                    <FixtureCell
                      key={idx}
                      fixture={fixture}
                      team={team}
                    ></FixtureCell>
                  ) : (
                    <EmptyFixtureCell key={idx} />
                  )
                )}
              </tr>
            ))}
        </tbody>
      </table>
      <pre>
        <code>{JSON.stringify(fixtures, null, 2)}</code>
      </pre>
    </div>
  );
}

export function getStaticPaths() {
  const years = CACHED_YEARS.map((year) =>
    CACHED_LEAGUES.map((league) => [year, league])
  ).flat();
  return {
    paths: years.map(([season, league]) => ({
      params: {
        league,
        season: String(season),
      },
    })),
    fallback: true,
  };
}
