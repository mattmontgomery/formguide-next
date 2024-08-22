export async function fetchLineups(params: {
  fixture: number;
  team: string;
}): Promise<TeamData[]> {
  return fetch(
    `https://api-football-v1.p.rapidapi.com/v3/fixtures/players?team=${params.team}&fixture=${params.fixture}`,
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
type Team = {
  id: number;
  name: string;
  logo: string;
  update: string;
};

export type Player = {
  id: number;
  name: string;
  photo: string;
};

type Games = {
  minutes: number | null;
  number: number;
  position: string;
  rating: string | null;
  captain: boolean;
  substitute: boolean;
};

type Shots = {
  total: number | null;
  on: number | null;
};

type Goals = {
  total: number | null;
  conceded: number | null;
  assists: number | null;
  saves: number | null;
};

type Passes = {
  total: number | null;
  key: number | null;
  accuracy: string | null;
};

type Tackles = {
  total: number | null;
  blocks: number | null;
  interceptions: number | null;
};

type Duels = {
  total: number | null;
  won: number | null;
};

type Dribbles = {
  attempts: number | null;
  success: number | null;
  past: number | null;
};

type Fouls = {
  drawn: number | null;
  committed: number | null;
};

type Cards = {
  yellow: number;
  red: number;
};

type Penalty = {
  won: number | null;
  commited: number | null;
  scored: number;
  missed: number;
  saved: number | null;
};

export type Statistics = {
  games: Games;
  offsides: number | null;
  shots: Shots;
  goals: Goals;
  passes: Passes;
  tackles: Tackles;
  duels: Duels;
  dribbles: Dribbles;
  fouls: Fouls;
  cards: Cards;
  penalty: Penalty;
};

export type PlayerStatistics = {
  player: Player;
  statistics: Statistics[];
};

export type TeamData = {
  team: Team;
  players: PlayerStatistics[];
};
