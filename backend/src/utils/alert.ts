import { logger } from "./logger";

export type AlertPayload = {
  message: string;
  severity: "low" | "medium" | "high";
  context?: Record<string, unknown>;
};

export const alertService = {
  notify: (payload: AlertPayload) => {
    logger.warn(`alert:${payload.message}`, {
      severity: payload.severity,
      ...payload.context,
    });
  },
};
