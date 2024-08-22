import {
  CACHED_LEAGUES,
  CACHED_YEARS,
  LEAGUES,
} from "@/services/api-football/constants";
import {
  convertFixturesToTeamMap,
  fetchFixturesForLeagueAndSeason,
} from "@/services/api-football/fixtures";
import { cache } from "react";
import Chart from "./Chart";

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
  return <Chart fixturesByTeam={fixturesByTeam} />;
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
