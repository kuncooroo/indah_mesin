export type ActionResult<T = undefined> = {
  success: boolean;
  message: string;
  errorCode?: string;
  fieldErrors?: Record<string, string>;
  data?: T;
};

export function ok<T = undefined>(message: string, data?: T): ActionResult<T> {
  return { success: true, message, data };
}

export function fail(
  message: string,
  opts?: { errorCode?: string; fieldErrors?: Record<string, string> }
): ActionResult {
  return {
    success: false,
    message,
    errorCode: opts?.errorCode,
    fieldErrors: opts?.fieldErrors,
  };
}
