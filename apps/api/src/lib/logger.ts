import winston from 'winston';
import path from 'path';

// Define log format
const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
            let msg = `${timestamp} [${level}]: ${message}`;
            if (Object.keys(meta).length > 0) {
                  msg += ` ${JSON.stringify(meta, null, 2)}`;
            }
            return msg;
      })
);

// Create logger instance
export const logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      defaultMeta: { service: 'ecommerce-api' },
      transports: [
            // Console transport for development
            new winston.transports.Console({
                  format: consoleFormat,
            }),
            // File transport for errors
            new winston.transports.File({
                  filename: path.join(__dirname, '../../logs/error.log'),
                  level: 'error',
                  maxsize: 5242880, // 5MB
                  maxFiles: 5,
            }),
            // File transport for all logs
            new winston.transports.File({
                  filename: path.join(__dirname, '../../logs/combined.log'),
                  maxsize: 5242880, // 5MB
                  maxFiles: 5,
            }),
      ],
});

// Stream for Morgan HTTP logger
export const stream = {
      write: (message: string) => {
            logger.info(message.trim());
      },
};
