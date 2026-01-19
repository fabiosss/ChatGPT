export type League =
  | "Serie A"
  | "Bundesliga"
  | "La Liga"
  | "Ligue 1"
  | "Premier League";

export type RawMatch = {
  id: string;
  league: League;
  homeTeam: string;
  awayTeam: string;
  kickoffUtc: string;
};

export type RawResult = RawMatch & {
  homeScore: number;
  awayScore: number;
  status: "final";
};

export type CalendarConnector = {
  league: League;
  fetchUpcomingMatches: () => Promise<RawMatch[]>;
};

export type ResultsConnector = {
  league: League;
  fetchFinalResults: () => Promise<RawResult[]>;
};
