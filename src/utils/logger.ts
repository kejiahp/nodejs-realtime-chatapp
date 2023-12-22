import config from "config";
import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, timestamp, label }) => {
  return `${label} [${timestamp}] [${level}]: ${message}`;
});

const logger = createLogger({
  level: "debug",

  format: combine(
    format.colorize(),
    label({ label: "LOG" }),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    myFormat
  ),
});

if (config.get("node_env") !== "production") {
  logger.add(new transports.Console());
} else {
  logger.add(
    new transports.File({ filename: "log/combine.log", level: "info" })
  );
}

export default logger;

//BACKUP LOGGER
// const backupLogger = () => {
//   const myFormat = printf(({ level, message, timestamp }) => {
//       return `${timestamp} ${level}: ${message}`;
//     });

//   return createLogger({
//       level: 'debug',
//       // format: winston.format.simple(),
//       format: combine(
//           format.colorize(),
//           label({ label: 'right meow!' }),
//           timestamp({format: "HH:mm:ss"}),
//           myFormat
//         ),

//       //defaultMeta: { service: 'user-service' },
//       transports: [
//           new transports.Console(),
// new transports.File({
//     filename: 'errors.log',

//   })
//       ],
//     });
// }
