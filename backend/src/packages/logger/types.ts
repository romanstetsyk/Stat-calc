type LogFn = (message: string, parameters?: Record<string, unknown>) => void;

type Logger = {
  level: string;
  fatal: LogFn;
  error: LogFn;
  warn: LogFn;
  info: LogFn;
  debug: LogFn;
  trace: LogFn;
  silent: LogFn;
};

export type { Logger };
