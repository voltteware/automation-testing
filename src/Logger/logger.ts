import winston, { createLogger, transports } from 'winston'
import {currentTestCaseID} from './../hooks/setup-api'
const format = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    winston.format.splat(),
    // winston.format.colorize({all:true}),
    winston.format.printf(
        log => {
            return `[${log.timestamp}] [${log.level}] [${currentTestCaseID}] ${log.message}`;
        }
    )
)

const logger = createLogger({
    transports: [
        new transports.Console({ format }),
        new transports.File({
            dirname: 'logs',
            filename: 'log_file.log',
            format
        }),
    ]
})
export default logger
