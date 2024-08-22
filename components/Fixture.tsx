import { Fixture } from "@/services/api-football/fixtures";
import clsx from "clsx";
import { PropsWithChildren } from "react";

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
    <GenericFixtureCell
      className={clsx({
        "font-bold ": true,
        "bg-lime-500": homeTeamResult === "W",
        "bg-amber-300": homeTeamResult === "D",
        "bg-red-300": homeTeamResult === "L",
      })}
    >
      {homeTeamResult}
    </GenericFixtureCell>
  );
}

export function GenericFixtureCell({
  children,
  className,
}: PropsWithChildren<{
  className: string;
}>) {
  return (
    <Cell
      className={clsx(className, "min-w-4 px-1 border-solid border-[1px] h-6")}
    >
      {children}
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
