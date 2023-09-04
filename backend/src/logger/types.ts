type LogFn = (message: string, parameters?: Record<string, unknown>) => void;

type Logger = {
  fatal: LogFn;
  error: LogFn;
  warn: LogFn;
  info: LogFn;
  debug: LogFn;
  trace: LogFn;
};

export type { Logger };
