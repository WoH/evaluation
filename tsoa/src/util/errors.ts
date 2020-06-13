export interface ErrorMessage {
  message: string;
  details?: string | { [name: string]: unknown };
}
