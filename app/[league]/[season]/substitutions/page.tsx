import { cache } from "react";
import {
  convertFixturesToTeamMap,
  fetchFixturesForLeagueAndSeason,
} from "@/services/api-football/fixtures";
import {
  CACHED_LEAGUES,
  CACHED_YEARS,
  LEAGUES,
} from "@/services/api-football/constants";
import { EmptyFixtureCell,  GenericFixtureCell } from "@/components/Fixture";
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
  fixtures.forEach(f => {
    if (f.fixture.status?.long === "Match Finished") {
    console.log(f)
    }
  })
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
                    <GenericFixtureCell
                      key={idx}
                      className=""
                    >{JSON.stringify(fixture)}</GenericFixtureCell>
                  ) : (
                    <EmptyFixtureCell key={idx} />
                  )
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export function generateStaticParams() {
  const years = CACHED_YEARS.map((year) =>
    CACHED_LEAGUES.map((league) => [year, league])
  ).flat();
  return years.map(([season, league]) => ({
    league,
    season: String(season),
  }));
}
