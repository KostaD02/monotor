export interface ErrorResponse {
  error: string;
  errorKeys: string | string[];
  help: string;
  path: string;
  statusCode: number;
  timestamp: string;
}
