import { alertService } from "../../utils/alert";
import { logger } from "../../utils/logger";
import { League, RawResult, ResultsConnector } from "./types";

const DEFAULT_BASE_URL = "https://api.example.com/football";

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`results fetch failed: ${response.status}`);
  }

  return (await response.json()) as T;
};

const buildConnector = (league: League): ResultsConnector => ({
  league,
  fetchFinalResults: async () => {
    const baseUrl = process.env.FOOTBALL_DATA_BASE_URL ?? DEFAULT_BASE_URL;
    const url = `${baseUrl}/results?league=${encodeURIComponent(league)}`;

    try {
      const data = await fetchJson<RawResult[]>(url);
      return data.map((match) => ({ ...match, league, status: "final" }));
    } catch (error) {
      logger.error("results connector failed", { league, url, error });
      alertService.notify({
        message: "results connector failed",
        severity: "medium",
        context: { league, url },
      });
      return [];
    }
  },
});

export const resultsConnectors: ResultsConnector[] = [
  buildConnector("Serie A"),
  buildConnector("Bundesliga"),
  buildConnector("La Liga"),
  buildConnector("Ligue 1"),
  buildConnector("Premier League"),
];
