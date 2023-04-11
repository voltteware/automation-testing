
var reporter = require('cucumber-html-reporter');
const GoogleDriveService = require('./util/google.service');
const fs = require('fs');
require('dotenv').config();

let ms = new Date();
console.log(ms)
const dateFormat = `${ms.getFullYear()}_${ms.getMonth() + 1}_${ms.getDate()}_${ms.getHours()}_${ms.getMinutes()}_${ms.getSeconds()}`;
const env = (process.env.BASE_URL.includes('dev') ? 'DEV' : 'PREPROD');
console.log(env)

const reportJson = require('path').join(__dirname, 'reports', 'cucumber-report.json');
const generateHtml = require('path').join(__dirname, 'reports', `cucumber-html-report-${env}-${dateFormat}.html`);


console.log('+++++++++++ Generate report++++++++++++++++', generateHtml);

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
        "Generate Report Datetime": ms
    }
};

reporter.generate(options);
//more info on `metadata` is available in `options` section below.
//to generate consodilated report from multi-cucumber JSON files, please use `jsonDir` option instead of `jsonFile`. More info is available in `options` section below.

function sleep(s){
  return new Promise(resolve => setTimeout(resolve, s * 1000));
};
async function uploadReportHtml() {
    await sleep(10);
    try{
        const driveClientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
        const driveClientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
        const driveRedirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI;
        const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
        const accessToken = process.env.GOOGLE_DRIVE_ACCESS_TOKEN;
        const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME || 'ForecastRx-Automation-Testing-Reports';

        if(!driveClientId) {
            return;
        }

        console.log('Uploading report file');
        const googleDriveService = new GoogleDriveService(driveClientId, driveClientSecret, driveRedirectUri, driveRefreshToken, accessToken);
        const fileName = `cucumber-html-report-${env}-${dateFormat}.html`;
        const filePath = __dirname + `/reports/${fileName}`;
        if (!fs.existsSync(filePath)) {
            throw new Error('File not found!');
        }

        let folder = await googleDriveService.searchFolder(folderName).catch((error) => {
            console.error(error);
            return null;
        });

        if (!folder) {
            folder = await googleDriveService.createFolder(folderName);
        }

        await googleDriveService.saveFile(fileName, filePath, '[*/*]', folder.id).catch((error) => {
            console.error(error);
        });

        console.info('File uploaded successfully!');
    } catch(err) {
        console.log('Error upload file: ', err);
    }
}

uploadReportHtml();
