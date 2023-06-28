import winston, { createLogger, transports } from 'winston';
import {currentTestCaseIDApi} from './../hooks/setup-api';
import {currentTestCaseIDUi} from './../hooks/setup-ui';
const format = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    winston.format.splat(),
    // winston.format.colorize({all:true}),
    winston.format.printf(
        log => {
            return `[${log.timestamp}] [${log.level}] [${currentTestCaseIDApi === undefined ? currentTestCaseIDUi : currentTestCaseIDApi}] ${log.message}`;
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
