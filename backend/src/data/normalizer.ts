import { RawMatch, RawResult } from "./sources/types";

export type NormalizedMatch = {
  id: string;
  league: string;
  kickoffUtc: string;
  homeTeam: string;
  awayTeam: string;
  status: "scheduled" | "final";
  score?: {
    home: number;
    away: number;
  };
};

const normalizeUpcoming = (match: RawMatch): NormalizedMatch => ({
  id: match.id,
  league: match.league,
  kickoffUtc: match.kickoffUtc,
  homeTeam: match.homeTeam,
  awayTeam: match.awayTeam,
  status: "scheduled",
});

const normalizeResult = (result: RawResult): NormalizedMatch => ({
  id: result.id,
  league: result.league,
  kickoffUtc: result.kickoffUtc,
  homeTeam: result.homeTeam,
  awayTeam: result.awayTeam,
  status: "final",
  score: {
    home: result.homeScore,
    away: result.awayScore,
  },
});

export const normalizeMatches = (upcoming: RawMatch[], results: RawResult[]) => {
  const normalizedUpcoming = upcoming.map(normalizeUpcoming);
  const normalizedResults = results.map(normalizeResult);

  return [...normalizedUpcoming, ...normalizedResults];
};
