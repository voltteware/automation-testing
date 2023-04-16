import {
  ITestCaseHookParameter,
  ITestStepHookParameter,
  setWorldConstructor,
  World,
} from "@cucumber/cucumber";
import {
  Browser,
  BrowserContext,
  chromium,
  expect,
  firefox,
  Page,
  request,
  webkit,
} from "@playwright/test";
import { existsSync, readdir, rename, rmSync } from "node:fs";
import { config } from "../../playwright.config";

export class ActionWords {
  timestamp = this.formatDate(new Date());

  async createBrowser(
    globalWithBrowser: typeof globalThis & { browser: Browser }
  ) {
    switch (config.browser) {
      case "firefox":
        globalWithBrowser.browser = await firefox.launch(config.browserOptions);
        break;
      case "webkit":
        globalWithBrowser.browser = await webkit.launch(config.browserOptions);
        break;
      default:
        globalWithBrowser.browser = await chromium.launch(
          config.browserOptions
        );
        break;
    }
  }

  async closeBrowser(
    globalWithBrowser: typeof globalThis & { browser: Browser }
  ) {
    await globalWithBrowser.browser?.close();
  }

  async createNewContext(
    globalWithBrowser: typeof globalThis & { browser: Browser },
    scenario: ITestCaseHookParameter
  ) {
    return await globalWithBrowser.browser.newContext({
      baseURL: config.BASE_URL,
      ignoreHTTPSErrors: true,
      locale: "en-US",
      recordVideo: {
        dir:
          "./videos/" +
          scenario.gherkinDocument.feature?.name +
          this.timestamp +
          "/",
      },
    });
  }

  async createNewPage(context: BrowserContext) {
    return await context.newPage();
  }

  async closePage(context: BrowserContext, page: Page) {
    await page.close();
    await context.close();
  }

  async createRequestContext() {
    return await request.newContext({
      baseURL: config.BASE_URL,
      ignoreHTTPSErrors: true,
    });
  }
  padTo2Digits(num: number) {
    return num.toString().padStart(2, "0");
  }
  formatDate(date: Date) {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join("") +
      "_" +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join("")
    );
  }
  async storeLogFile() {
    if (existsSync("logs/log_file.log")) {
      rename(
        "logs/log_file.log",
        "logs/log_file_" + this.timestamp + ".log",
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  }

  async captureScreenshots(
    page: Page,
    testStep: ITestStepHookParameter,
    timestamp: string
  ) {
    const imageName = testStep.pickleStep.text
      .replaceAll('"', "")
      .replaceAll("<", "")
      .replaceAll(">", "");
    await page.screenshot({
      path:
        "screenshots/" +
        testStep.gherkinDocument.feature?.name +
        this.timestamp +
        "/" +
        testStep.pickle.name +
        timestamp +
        "/" +
        imageName +
        ".png",
    });
  }

  async recordVideos(page: Page, scenario: ITestCaseHookParameter) {
    let timestamp: string = await this.formatDate(new Date());
    let statusOfScenario = scenario.result?.status;
    let pathOfVideo = <string>await page.video()?.path();
    let dirFeatureName =
      scenario.gherkinDocument.feature?.name + this.timestamp;
    switch (config.video) {
      case "off":
        rmSync("videos/" + dirFeatureName + "/", { recursive: true });
        break;
      case "retain-on-failure":
        if (statusOfScenario == "PASSED") {
          rmSync(pathOfVideo, { recursive: true });
          readdir("videos/" + dirFeatureName, function (err, data) {
            if (data.length == 0) {
              rmSync("videos/" + dirFeatureName, { recursive: true });
            }
          });
        } else {
          rename(
            pathOfVideo,
            "./videos/" +
              dirFeatureName +
              "/" +
              scenario.pickle.name +
              timestamp +
              ".mp4",
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        break;
      default:
        rename(
          pathOfVideo,
          "./videos/" +
            dirFeatureName +
            "/" +
            scenario.pickle.name +
            timestamp +
            ".mp4",
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
        break;
    }
  }
}

export function generateRandomNumbers(
  desiredSum: number,
  length: number
): number[] {
  const numbers: number[] = [];
  let sum = 0;

  // Generate X random numbers
  for (let i = 0; i < length; i++) {
    const randomNum = Math.floor(Math.random() * 101);
    numbers.push(randomNum);
    sum += randomNum;
  }

  // Scale numbers to desired sum
  const scalingFactor = desiredSum / sum;
  for (let i = 0; i < length; i++) {
    numbers[i] = Math.round(numbers[i] * scalingFactor);
  }

  // Adjust sum to account for rounding errors
  const actualSum = numbers.reduce((a, b) => a + b, 0);
  const diff = desiredSum - actualSum;
  numbers[0] += diff;

  return numbers;
}

class CustomWorld extends World {
  countErrors = 0;
  constructor(options: any) {
    super(options);
    // // Bind the custom soft assertion function to the World object
    // this.softAssert = this.softAssert.bind(this);
  }
  async softAssert(expression: boolean, errorMessage?: string) {
    try {
      expect(expression).toBeTruthy();
    } catch (err: any) {
      this.countErrors += 1;
      this.attach(`${this.countErrors}. Soft assert failed: ${errorMessage}`);
    }
  }
}
setWorldConstructor(CustomWorld);
