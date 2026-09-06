export type ActionError<T> = {
  error: string;
  fieldErrors?: {
    [K in keyof T]?: string[];
  };
};

export type Ok<T> = { ok: true; data: T };
export type Err<T = any> = { ok: false } & ActionError<T>;
export type Result<TData, TInput = any> = Ok<TData> | Err<TInput>;

export const ok = <T>(data: T): Ok<T> => ({ ok: true, data });

export const err = <TInput = any>(
  message: string,
  fieldErrors?: Err<TInput>["fieldErrors"]
): Err<TInput> => ({
  ok: false,
  error: message,
  fieldErrors,
});