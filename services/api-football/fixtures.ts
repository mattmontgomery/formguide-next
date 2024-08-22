import { LEAGUES } from "./constants";

export type Fixture = {
  fixture: {
    id: number;
    referee: string;
    timezone: "UTC";
    date: string;
    timestamp: number;
    periods: {
      first: number;
      second: number;
    };
    venue: {
      id: number;
      name: string;
      city: string;
    };
    status: {
      long: "Match Finished" | "Not Started" | "Match Postponed";
      short: "FT" | "NS";
      elapsed: number;
    };
  };

  teams: {
    home: {
      id: number;
      name: string;
      winner: boolean;
    };
    away: {
      id: number;
      name: string;
      winner: boolean;
    };
  };
  score: {
    fulltime: {
      home: number;
      away: number;
    };
    halftime: {
      home: number;
      away: number;
    };
    extratime: {
      home: number;
      away: number;
    };
    penalty: {
      home: number;
      away: number;
    };
  };
};

export async function fetchFixturesForLeagueAndSeason(
  league: keyof typeof LEAGUES,
  season: string
): Promise<Fixture[]> {
  return fetch(
    `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${LEAGUES[league]}&season=${season}`,
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
    .then((data) => data.response);
}
export async function fetchFixtures(params: {
  league: keyof typeof LEAGUES;
  season: string;
  team?: string;
}): Promise<Fixture[]> {
  return fetch(
    `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${
      LEAGUES[params.league]
    }&season=${params.season}${params.team ? `&team=${params.team}` : ""}`,
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
    .then((data) => data.response);
}

export function convertFixturesToTeamMap(
  fixtures: Fixture[]
): Record<string, Fixture[]> {
  const fixturesByTeam = fixtures.reduce((acc, fixture) => {
    const homeTeam = fixture["teams"]["home"]["name"];
    const awayTeam = fixture["teams"]["away"]["name"];

    if (!Array.isArray(acc[homeTeam])) {
      acc[homeTeam] = [fixture];
    } else {
      acc[homeTeam].push(fixture);
    }
    if (!Array.isArray(acc[awayTeam])) {
      acc[awayTeam] = [fixture];
    } else {
      acc[awayTeam].push(fixture);
    }

    return acc;
  }, {} as ReturnType<typeof convertFixturesToTeamMap>);
  // sort fixtures
  return Object.keys(fixturesByTeam).reduce((acc, team) => {
    acc[team] = fixturesByTeam[team].sort((a, b) => {
      const dateA = new Date(a.fixture.date);
      const dateB = new Date(b.fixture.date);
      return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
    });
    return acc;
  }, fixturesByTeam);
}
