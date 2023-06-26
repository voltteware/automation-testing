
var reporter = require('cucumber-html-reporter');
require('dotenv').config();

let ms = new Date();
console.log(ms)
const dateFormat = `${ms.getFullYear()}_${ms.getMonth() + 1}_${ms.getDate()}_${ms.getHours()}_${ms.getMinutes()}_${ms.getSeconds()}`;
const env = (process.env.BASE_URL.includes('dev') ? 'DEV' : 'PREPROD');
console.log(env)

const reportJson = require('path').join(__dirname, 'reports', 'cucumber-report.json');
const generateHtml = require('path').join(__dirname, 'reports', `cucumber-html-report-${env}-${dateFormat}.html`);


console.log('+++++++++++ Generate report ++++++++++++++++', generateHtml);

var options = {
    theme: 'bootstrap',
    jsonFile: reportJson,
    output: generateHtml,
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: true,
    columnLayout: 1,
    theme: "hierarchy",
    name: 'ForecastRx Automation',
    metadata: {
        "Test Environment": env,
        "Sprint": process.env.SPRINT,
        "Generate Report DateTime": ms
    }
};

reporter.generate(options);
//more info on `metadata` is available in `options` section below.
//to generate consolidated report from multi-cucumber JSON files, please use `jsonDir` option instead of `jsonFile`. More info is available in `options` section below.

