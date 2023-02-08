# Automatic Screenshot
- Allow to setup screenshot only when test fail (required)
- Allow to setup screenshot for each step. Could turn on/off this option(optional)
https://playwright.dev/docs/test-configuration#automatic-screenshots

Note:
1. Screenshots will be put in a folder
2. Screenshots will display in cucumber report
3. 

## Record video

'retain-on-failure' - Record video for each test, but remove all videos from successful test runs.

Video files will appear in the test output directory like test-results -> test case name -> video.mp4 or video.mkv

https://playwright.dev/docs/test-configuration#record-video

Notes:
@Nancy
- configuration to keep all / test failure only
- Check when the test failed then re-try : how many recorded videos? should record both==> should naming as `test_feature_timestamp`

## Log File (low priority)

Store log file to debug fail test case. 
- Logs file name should includes date time 

Example: https://giangtester.com/bai-24-su-dung-log4j-de-debug-trong-selenium-webdriver/
https://www.youtube.com/watch?v=HtVJhuKv2zA&list=PL699Xf-_ilW7EyC6lMuU4jelKemmS6KgD&index=51

- Each row should have format:
{HH:mm:ss.SSS} {level} {message}

Note:
@Nancy:
- add Date into log, 
- log file name should include date_time
- display log failure in playwright
- display error in tab console log
- 

## Cucumber Log (high priority)
- follow format:
{Date-Month-YYYY:HH:mm:ss.SSS} {level} {message}
