export const LEAGUES = {
  mls: 253,
  nwsl: 254,
  mlsnp: 909,
  usl1: 489,
  usl2: 256,
  uslc: 255,
  nisa: 523,
  epl: 39,
  ligamx: 262,
  ligamx_ex: 263,
  de_bundesliga: 78,
  de_2_bundesliga: 79,
  de_3_liga: 80,
  de_frauen_bundesliga: 82,
  sp_la_liga: 140,
  sp_segunda: 141,
  sp_primera_femenina: 142,
  en_championship: 40,
  en_league_one: 41,
  en_league_two: 42,
  en_national: 43,
  en_fa_wsl: 44,
  fr_ligue_1: 61,
  fr_ligue_2: 62,
  fr_national_1: 63,
  fr_feminine: 64,
  it_serie_a: 135,
  it_serie_b: 136,
  it_serie_a_women: 139,
  leagues_cup: 772,
};

export const ELIGIBLE_YEARS = [
  2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014,
];
export const CACHED_YEARS = ELIGIBLE_YEARS.slice(0, 3);
export const CACHED_LEAGUES = [
  "epl",
  "de_bundesliga",
  "sp_la_liga",
  "it_serie_a",
  "fr_ligue_1",
  "mls",
  "nwsl",
];

export const LEAGUE_DISPLAY_NAMES: Record<string, string> = {
  mls: "MLS",
  nwsl: "NWSL",
  mlsnp: "MLS Next Pro",
  uslc: "USL Championship",
  usl1: "USL League One",
  usl2: "USL League Two",
  nisa: "NISA",
  ligamx: "Liga MX",
  ligamx_ex: "Liga de Expansión MX",
  epl: "English Premier League",
  de_bundesliga: "Germany — Bundesliga",
  de_2_bundesliga: "Germany — 2. Bundesliga",
  de_3_liga: "Germany — 3. Liga",
  de_frauen_bundesliga: "Germany — Frauen-Bundesliga",
  en_fa_wsl: "England — FA WSL",
  en_championship: "England — EFL Championship",
  en_league_one: "England — EFL League One",
  en_league_two: "England — EFL League Two",
  en_national: "England — National League",
  fr_feminine: "France — Division One Féminine",
  fr_ligue_1: "France — Ligue 1",
  fr_ligue_2: "France — Ligue 2",
  fr_national_1: "France — National 1",
  sp_la_liga: "Spain — LaLiga",
  sp_segunda: "Spain — LaLiga 2",
  sp_primera_femenina: "Spain — Liga F",
  it_serie_a: "Italy — Serie A",
  it_serie_b: "Italy — Serie B",
  it_serie_a_women: "Italy — Seria A Women",
  leagues_cup: "Leagues Cup",
};
