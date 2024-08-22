// import { Cell, EmptyFixtureCell, FixtureCell } from "@/app/Fixture";
import { PointsChart } from "@/components/charts/Points";
import { Title } from "@/components/Title";
import { LEAGUES } from "@/services/api-football/constants";
import {
  convertFixturesToTeamMap,
  fetchFixturesForLeagueAndSeason,
} from "@/services/api-football/fixtures";
import { Grid } from "@visx/grid";
import { cache } from "react";

const cached_fetchFixturesForLeagueAndSeason = cache(
  fetchFixturesForLeagueAndSeason
);

export default async function FormRollingPage({
  params,
}: {
  params: { league: string; season: string };
}) {
  const fixtures = await cached_fetchFixturesForLeagueAndSeason(
    params.league as keyof typeof LEAGUES,
    params.season
  );
  const fixturesByTeam = convertFixturesToTeamMap(fixtures);
  const periodLength = 8;
  const rollingPointsByTeam = Object.keys(fixturesByTeam).reduce(
    (acc, team) => {
      const fixtures = fixturesByTeam[team];
      const pointsPerMatch = fixtures
        .filter((fixture) => fixture.fixture.status.long === "Match Finished")
        .map((fixture) => {
          const teamIsHomeTeam = fixture.teams.home.name === team;
          const homeTeamResult = fixture.teams[teamIsHomeTeam ? "home" : "away"]
            .winner
            ? "W"
            : fixture.teams[teamIsHomeTeam ? "away" : "home"].winner
            ? "L"
            : "D";
          return homeTeamResult === "W" ? 3 : homeTeamResult === "D" ? 1 : 0;
        });
      const rollingPoints = [];
      for (let i = 0; i <= pointsPerMatch.length - 5; i++) {
        const fiveMatchPoints = pointsPerMatch
          .slice(i, i + periodLength)
          .reduce((sum: number, points) => sum + points, 0);
        rollingPoints.push(fiveMatchPoints);
      }
      return { ...acc, [team]: rollingPoints };
    },
    {} as Record<string, number[]>
  );
  return (
    <div className="grid grid-flow-row gap-y-4">
      <Title>Form Guide | Rolling 5-game</Title>
      <table className="table">
        <tbody>
          {Object.keys(fixturesByTeam)
            .sort()
            .map((team) => (
              <tr key={team} className="table-row">
                <td className="table-cell">{team}</td>
                <td>
                  <div className="h-16 py-2">
                    <PointsChart
                      points={rollingPointsByTeam[team]}
                      periodLength={periodLength}
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
