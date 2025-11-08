// Simple console wrapper: formatted in development, silenced in production
// Imported for side effects to patch global console methods consistently
const isProduction = process.env.NODE_ENV === 'production';

type ConsoleMethod = 'log' | 'debug' | 'info' | 'warn' | 'error';

const originalConsole = {
  log: console.log.bind(console),
  debug: console.debug.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};

const redactKeys = ['password', 'token', 'secret', 'apiKey', 'key', 'authorization'];

function sanitize(value: unknown, seen = new WeakSet()): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') {
    // Redact likely secrets in long strings
    if (value.length > 64) return '[redacted:string]';
    return value;
  }
  if (typeof value !== 'object') return value;
  if (seen.has(value as object)) return '[redacted:circular]';
  seen.add(value as object);
  try {
    const obj = value as Record<string, unknown>;
    if (Array.isArray(obj)) return obj.map((v) => sanitize(v, seen));
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (redactKeys.some((rk) => k.toLowerCase().includes(rk))) {
        out[k] = '[redacted]';
      } else {
        out[k] = sanitize(v, seen);
      }
    }
    return out;
  } catch {
    return '[redacted:unserializable]';
  }
}

function format(level: ConsoleMethod, args: unknown[]): any[] {
  const prefix = `[Applynify][${level.toUpperCase()}]`;
  const ts = new Date().toISOString();
  // Sanitize objects; keep primitives readable
  const formatted = args.map((a) => {
    if (typeof a === 'string' || typeof a === 'number' || typeof a === 'boolean') return a;
    try {
      return sanitize(a);
    } catch {
      return '[redacted:format-error]';
    }
  });
  return [`${prefix} ${ts}:`, ...formatted];
}

function patch(method: ConsoleMethod) {
  // Silence entirely in production
  if (isProduction) {
    // @ts-ignore
    console[method] = () => {};
    return;
  }
  // Pretty, consistent logs in development
  // @ts-ignore
  console[method] = (...args: unknown[]) => {
    // @ts-ignore
    originalConsole[method](...format(method, args));
  };
}

(['log', 'debug', 'info', 'warn', 'error'] as ConsoleMethod[]).forEach(patch);

export {}; // side-effect only module
