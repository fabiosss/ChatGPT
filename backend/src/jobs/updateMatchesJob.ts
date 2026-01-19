import { calendarConnectors } from "../data/sources/calendar";
import { resultsConnectors } from "../data/sources/results";
import { normalizeMatches } from "../data/normalizer";
import { alertService } from "../utils/alert";
import { logger } from "../utils/logger";

export type MatchUpdatePayload = {
  normalized: ReturnType<typeof normalizeMatches>;
};

export const runUpdateMatchesJob = async (): Promise<MatchUpdatePayload> => {
  try {
    const upcomingLists = await Promise.all(
      calendarConnectors.map((connector) => connector.fetchUpcomingMatches())
    );
    const resultsLists = await Promise.all(
      resultsConnectors.map((connector) => connector.fetchFinalResults())
    );

    const upcoming = upcomingLists.flat();
    const results = resultsLists.flat();

    const normalized = normalizeMatches(upcoming, results);

    logger.info("match update job completed", {
      upcoming: upcoming.length,
      results: results.length,
      normalized: normalized.length,
    });

    return { normalized };
  } catch (error) {
    logger.error("match update job failed", { error });
    alertService.notify({
      message: "match update job failed",
      severity: "high",
    });
    return { normalized: [] };
  }
};
