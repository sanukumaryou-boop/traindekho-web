export type ApiResponseExample = {
  status: number;
  description: string;
  example: string;
};

function error(status: number, description: string, code: string, message: string): ApiResponseExample {
  return {
    status,
    description,
    example: JSON.stringify({ error: { code, message } }, null, 2),
  };
}

export const sharedErrors: Record<number, ApiResponseExample> = {
  400: error(400, "A path or query value is missing or has the wrong format.", "INVALID_REQUEST", "Request is invalid."),
  401: error(401, "The API key is missing, unknown, expired, or revoked.", "UNAUTHORIZED", "Authentication is required."),
  403: error(403, "The credential is valid and does not include this API.", "FORBIDDEN", "You do not have access to this API."),
  404: error(404, "The train or station does not exist.", "NOT_FOUND", "Not found."),
  429: {
    status: 429,
    description: "The caller exceeded a rate limit or a quota. Wait for Retry-After seconds before retrying.",
    example: JSON.stringify(
      {
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "API request limit exceeded",
        },
      },
      null,
      2,
    ),
  },
  500: error(500, "The request could not be completed.", "INTERNAL_ERROR", "The request could not be completed."),
  502: error(502, "Live status could not be loaded.", "UPSTREAM_UNAVAILABLE", "Live status is temporarily unavailable."),
};

export const standardErrors = [400, 401, 403, 429, 500];

export function responseExamples(success: ApiResponseExample, statuses: number[]) {
  return [success, ...statuses.map((status) => sharedErrors[status])];
}
