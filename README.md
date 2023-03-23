# ForecastEx Automation Test

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
- npm run cucumber-multiple-html-reporter

## Install Extensions:

- Cucumber (Gherkin) Full Support: https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete
    1. Open your app in VS Code
    2. Install cucumberautocomplete extension
    3. In the opened app root create (if absent) .vscode folder with settings.json file or just run mkdir .vscode && touch .vscode/settings.json
    4. Add all the needed settings to the settings.json file
    5. Reload app to apply all the extension changes

## Performance:
### Run Performance:
- To start Performance Test script, you need:
    1. Run ```npm run start```
    2. Copy file users.json into dist folder
    3. Run ```npm run log-in ```

### You can also run a test locally and stream the results to the K6 Cloud:
- Log in to the k6 Cloud
  - ```k6 login cloud --token 2152b58d9e1726e9e0b16d3c23d2cce235684102c7bc4bcdda50921dc3492324```  
- Run the tests and upload the results
  - ```k6 run --out cloud ./dist/fullflowlogin.test.js```   
- After running the command, the console shows an URL. Copy this URL and paste it in your browser's address bar to visualize the test results.

![image](https://user-images.githubusercontent.com/109567663/221473979-fc42d332-8f1f-4fcf-9db9-c600eea2125c.png)

- Log in by account:
  - ```testautoforecast@gmail.com```
  - ```Ph@@21102001```

- References: ```https://k6.io/docs/results-output/real-time/cloud/```