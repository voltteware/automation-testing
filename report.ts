import * as reporter from 'cucumber-html-reporter'
var options:reporter.Options={
    theme:'bootstrap',
    jsonFile:'./report/report.json',
    output:'./report/cucumber-html-report.html',
    screenshotsDirectory:'screenshots/',
    storeScreenshots:true,
    reportSuiteAsScenarios:true,  
    scenarioTimestamp:true,  
    launchReport:true,
    ignoreBadJsonFile:true,    
}
reporter.generate(options)