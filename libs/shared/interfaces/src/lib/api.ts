export interface ErrorResponse {
  error: string;
  errorKeys: string | string[];
  help: string;
  path: string;
  statusCode: number;
  timestamp: string;
}

export interface DeleteResponse {
  deletedCount: number;
  acknowledged: boolean;
}
