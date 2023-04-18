const report = require("multiple-cucumber-html-reporter");
require('dotenv').config();
let ms = new Date();
console.log(ms)
const dateFormat = `${ms.getFullYear()}${ms.getMonth() + 1}${ms.getDate()}_${ms.getHours()}${ms.getMinutes()}${ms.getSeconds()}`;
const env = (process.env.BASE_URL.includes('dev') ? 'DEV' : 'PREPROD');
const AdmZip = require("adm-zip");
const GoogleDriveService = require('./util/google.service');
const fs = require('fs');
require('dotenv').config();

report.generate({
  jsonDir: "./reports",
  reportPath: `./reports/multiple-report/${env}-${dateFormat}`,
  // reportName: 'Total Duration:',
  hideMetadata: true,
  // metadata: {
  //   browser: {
  //     name: "chrome",
  version: "60",
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

function sleep(s) {
  return new Promise(resolve => setTimeout(resolve, s * 1000));
};
async function uploadReportFile() {
  await sleep(10);
  try {
    const driveClientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const driveClientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const driveRedirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI;
    const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
    const accessToken = process.env.GOOGLE_DRIVE_ACCESS_TOKEN;
    const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME || 'ForecastRx-Automation-Testing-Reports';

    if (!driveClientId) {
      return;
    }

    const googleDriveService = new GoogleDriveService(driveClientId, driveClientSecret, driveRedirectUri, driveRefreshToken, accessToken);

    // Zip workflow
    async function createZipArchive() {
      //Zip report
      const zip = new AdmZip();
      const outputFile = `report_${env.toLowerCase()}_${dateFormat}.zip`;
      zip.addLocalFolder("./reports");
      zip.addLocalFolder("./logs")
      zip.writeZip(outputFile);

      console.log('outputFile: ', outputFile);
      return outputFile;
    }
    const filePath = await createZipArchive();
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

    await googleDriveService.saveFile(filePath, filePath, '[*/*]', folder.id);

    fs.unlink(filePath, (error) => {
      if (error) {
        throw err
      }
    });

    console.info('File uploaded successfully!');
  } catch (err) {
    console.log('Error upload file: ', err);
    throw err
  }
}

uploadReportFile();