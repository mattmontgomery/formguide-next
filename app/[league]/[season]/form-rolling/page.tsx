import { LEAGUES } from "@/services/api-football/constants";
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
