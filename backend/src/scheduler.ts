import { runUpdateMatchesJob } from "./jobs/updateMatchesJob";
import { logger } from "./utils/logger";

const DEFAULT_INTERVAL_MS = 15 * 60 * 1000;

export const scheduleMatchUpdates = () => {
  const intervalMs = Number(process.env.MATCH_UPDATE_INTERVAL_MS ?? DEFAULT_INTERVAL_MS);

  logger.info("scheduling match update job", { intervalMs });

  runUpdateMatchesJob().catch((error) => {
    logger.error("initial match update job failed", { error });
  });

  return setInterval(() => {
    runUpdateMatchesJob().catch((error) => {
      logger.error("scheduled match update job failed", { error });
    });
  }, intervalMs);
};
