export type ValidationResult<T = any> = {
  success: boolean;
  key: string;
  message?: string;
  result?: T;
};
