const report = require("multiple-cucumber-html-reporter");
require('dotenv').config();
let ms = new Date();
console.log(ms)
const dateFormat = `${ms.getFullYear()}${ms.getMonth() + 1}${ms.getDate()}_${ms.getHours()}${ms.getMinutes()}${ms.getSeconds()}`;
const env = (process.env.BASE_URL.includes('dev') ? 'DEV' : 'PREPROD');

report.generate({
  jsonDir: "./reports",
  reportPath: `./reports/multiple-report/${env}-${dateFormat}`,
  // reportName: 'Total Duration:',
  hideMetadata: true,
  // metadata: {
  //   browser: {
  //     name: "chrome",
  //     version: "60",
  //   },
  //   device: "Local test machine",
  //   platform: {
  //     name: "macOS",
  //     version: "10.15.7",
  //   },
  // },
  customData: {
    title: "Run info",
    data: [
      { label: "Project", value: "ForecastRx Automation" },
      { label: "Sprint", value: process.env.SPRINT },
      { label: "Generate Report Datetime", value: dateFormat }
    ],
  },
  displayReportTime: false,
  displayDuration: true,
  durationInMS: false,
  openReportInBrowser: true,
});