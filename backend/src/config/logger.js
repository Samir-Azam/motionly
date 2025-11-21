import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, json, colorize } = format;

// Pretty console format (dev only)
const consoleFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} | ${level} | ${message}`;
});

// JSON format (prod)
const jsonFormat = combine(timestamp(), json());

const logger = createLogger({
  level: 'info',
  transports: [
    // Console logs
    new transports.Console({
      level: 'info',
      format:
        process.env.NODE_ENV === 'production'
          ? jsonFormat // prod → structured JSON
          : combine(colorize(), timestamp(), consoleFormat) // dev → pretty
    }),

    // File logs (all logs)
    new transports.File({
      filename: 'logs/combined.log',
      level: 'info',
      format: jsonFormat
    }),

    // File logs (errors only)
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: jsonFormat
    })
  ]
});

export default logger;
