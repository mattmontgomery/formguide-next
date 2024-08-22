import {
  CACHED_LEAGUES,
  CACHED_YEARS,
} from "@/services/api-football/constants";
import { fetchStandings } from "@/services/api-football/standings";
import Link from "next/link";

export default async function PlayerMinutesIndexPage(props: {
  params: { league: string; season: string };
}) {
  const standings = await fetchStandings({
    league: props.params.league,
    season: props.params.season,
  });
  const teams = standings[0]?.league?.standings
    .flat?.()
    .map((standing) => standing.team)
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div>
      {teams?.map?.((team) => (
        <div key={team.id}>
          <Link
            href={`/${props.params.league}/${props.params.season}/player-minutes-rolling/${team.id}`}
          >
            {team.name}
          </Link>
        </div>
      ))}
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
