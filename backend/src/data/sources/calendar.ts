import { alertService } from "../../utils/alert";
import { logger } from "../../utils/logger";
import { CalendarConnector, League, RawMatch } from "./types";

const DEFAULT_BASE_URL = "https://api.example.com/football";

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`calendar fetch failed: ${response.status}`);
  }

  return (await response.json()) as T;
};

const buildConnector = (league: League): CalendarConnector => ({
  league,
  fetchUpcomingMatches: async () => {
    const baseUrl = process.env.FOOTBALL_DATA_BASE_URL ?? DEFAULT_BASE_URL;
    const url = `${baseUrl}/calendar?league=${encodeURIComponent(league)}`;

    try {
      const data = await fetchJson<RawMatch[]>(url);
      return data.map((match) => ({ ...match, league }));
    } catch (error) {
      logger.error("calendar connector failed", { league, url, error });
      alertService.notify({
        message: "calendar connector failed",
        severity: "medium",
        context: { league, url },
      });
      return [];
    }
  },
});

export const calendarConnectors: CalendarConnector[] = [
  buildConnector("Serie A"),
  buildConnector("Bundesliga"),
  buildConnector("La Liga"),
  buildConnector("Ligue 1"),
  buildConnector("Premier League"),
];
