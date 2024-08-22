import { LEAGUES } from "./constants";

export type Standing = {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  form: string;
  status: string;
};

export async function fetchStandings(params: {
  league: string;
  season: string;
}): Promise<
  {
    league: {
      id: number;
      name: string;
      country: string;
      logo: string;
      flag: string;
      season: number;
      round: string;
      standings: Standing[];
    };
  }[]
> {
  const leagueCode = LEAGUES[params.league];
  console.log(leagueCode);
  if (!leagueCode) {
    return [];
  }
  return fetch(
    `https://api-football-v1.p.rapidapi.com/v3/standings?league=${leagueCode}&season=${params.season}`,
    {
      headers: {
        "x-rapidapi-key": process.env.API_FOOTBALL_API_KEY ?? "",
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      },
      next: {
        revalidate: 60 * 60, // 1 hour
      },
    }
  )
    .then((res) => res.json())
    .then((res) => res.response);
}
