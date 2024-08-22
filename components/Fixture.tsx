import { Fixture } from "@/services/api-football/fixtures";

export function FixtureCell({
  fixture,
  team,
}: {
  fixture: Fixture;
  team: string;
}) {
  const teamIsHomeTeam = fixture.teams.home.name === team;
  const homeTeamResult = fixture.teams[teamIsHomeTeam ? "home" : "away"].winner
    ? "W"
    : fixture.teams[teamIsHomeTeam ? "away" : "home"].winner
    ? "L"
    : "D";
  return (
    <Cell
      className={[
        `${homeTeamResult === "W" && "bg-lime-500"}`,
        `${homeTeamResult === "L" && "bg-red-300 "}`,
        `${homeTeamResult === "D" && "bg-amber-300  "}`,
        "min-w-4 px-1 border-solid border-[1px] h-6 font-bold ",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {homeTeamResult}
    </Cell>
  );
}

export function EmptyFixtureCell() {
  return (
    <Cell className="min-w-4 bg-zinc-200 border-solid border-[1px] border-zinc-300">
      -
    </Cell>
  );
}

export function Cell({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <td className={`table-cell text-center align-middle ${className ?? ""}`}>
      {children}
    </td>
  );
}
