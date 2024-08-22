"use client";

// import { Cell, EmptyFixtureCell, FixtureCell } from "@/app/Fixture";
import { PointsChart } from "@/components/charts/Points";
import { RadioInput } from "@/components/Form/Radio";
import { Title } from "@/components/Title";
import { Fixture } from "@/services/api-football/fixtures";
import { useMemo, useState } from "react";

export default function Chart({
  fixturesByTeam,
}: {
  fixturesByTeam: Record<string, Fixture[]>;
}) {
  const [periodLength, setPeriodLength] = useState<number>(5);
  const rollingPointsByTeam = useMemo(
    () =>
      Object.keys(fixturesByTeam).reduce((acc, team) => {
        const fixtures = fixturesByTeam[team];
        const pointsPerMatch = fixtures
          .filter((fixture) => fixture.fixture.status.long === "Match Finished")
          .map((fixture) => {
            const teamIsHomeTeam = fixture.teams.home.name === team;
            const homeTeamResult = fixture.teams[
              teamIsHomeTeam ? "home" : "away"
            ].winner
              ? "W"
              : fixture.teams[teamIsHomeTeam ? "away" : "home"].winner
              ? "L"
              : "D";
            return homeTeamResult === "W" ? 3 : homeTeamResult === "D" ? 1 : 0;
          });

        const rollingPoints = [];
        for (let i = 0; i <= pointsPerMatch.length - periodLength; i++) {
          const periodMatchPoints = pointsPerMatch
            .slice(i, i + periodLength)
            .reduce((sum: number, points) => sum + points, 0);
          rollingPoints.push(periodMatchPoints);
        }

        return { ...acc, [team]: rollingPoints };
      }, {} as Record<string, number[]>),
    [fixturesByTeam, periodLength]
  );
  return (
    <div className="grid grid-flow-row gap-y-4">
      <Title>Form Guide | Rolling {periodLength}-game</Title>
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
      <table className="table" key={periodLength}>
        <tbody>
          {Object.keys(rollingPointsByTeam)
            .sort()
            .map((team) => (
              <tr key={team} className="table-row">
                <td className="table-cell">{team}</td>
                <td>
                  <div className="h-16 py-2 mb-4">
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
