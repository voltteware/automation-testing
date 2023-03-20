# ForecastRx Automation Test

## How to run script from command line

## 1. Update test environment in .env file: TEST SITE or STAGING
## 2. Run command line to execute test and generate HTML report
- npm run test-api 
- npm run test-ui

Or Run command line below to execute test only

- npx cucumber-js --tags @api-login 
- npx cucumber-js --tags @test-api
- npx cucumber-js --tags @api-realm
- npx cucumber-js --tags @test-ui

Then Show report with Cucumber-HTML-Reporter
- npm run cucumber-html-reporter

## Install Extensions:

- Cucumber (Gherkin) Full Support: https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete
    1. Open your app in VS Code
    2. Install cucumberautocomplete extension
    3. In the opened app root create (if absent) .vscode folder with settings.json file or just run mkdir .vscode && touch .vscode/settings.json
    4. Add all the needed settings to the settings.json file
    5. Reload app to apply all the extension changes

## Run Performance:
- To start Performance Test script, you need:
    1. Run ```npm run start```
    2. Copy file users.json into dist folder
    3. Run ```npm run log-in ```