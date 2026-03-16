function log(level, message, meta) {
  const timestamp = new Date().toISOString();
  if (meta) {
    console[level](`[${timestamp}] ${message}`, meta);
    return;
  }
  console[level](`[${timestamp}] ${message}`);
}

const logger = {
  info: (message, meta) => log("log", message, meta),
  warn: (message, meta) => log("warn", message, meta),
  error: (message, meta) => log("error", message, meta),
};

export default logger;
