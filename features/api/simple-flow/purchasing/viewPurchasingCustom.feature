@test-api @api-purchasing @api-purchasing-custom
Feature: API_Purchasing Custom
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @TC_PC001-4 @smoke-test-api @api-purchasing-custom
    Scenario Outline: <TC_ID> - Verify items on Purchasing Custom of company <companyType>
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        # Get Company info before run forecast
        And user sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        # Run Forecast
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And User checks that the lastForecastDate field was updated and jobProcessing is false in company detail information after running forecast
        And User sets GET api endpoint to get count items in Purchasing Custom
        When User sends a GET request to get count items in Purchasing Custom
        Then The expected status code should be <expectedStatus>
        And User checks API contract get count items in purchasing custom are correct
        And User sets GET api endpoint to count items that is active and have lotMultipleItemKey is NULL
        And User sends a GET request to get count items active and have lotMultipleItemKey is NULL
        And User checks total items in Custom EQUALS total items active and have lotMultipleItemKey is NULL
        And User sets GET api endpoint to get items in Purchasing Custom
        And User sends a GET request to get items in Purchasing Custom
        And The expected status code should be <expectedStatus>
        And User checks API contract of item object is purchasing is correct
        And User picks max 10 random items in above list items
        And User checks random items has status is Active

        Examples:
            | TC_ID    | user  | email                      | password  | companyType | expectedStatus |
            | TC_PC001 | admin | testautoforecast@gmail.com | Test1111# | CSV         | 200            |
            | TC_PC002 | admin | testautoforecast@gmail.com | Test1111# | ASC         | 200            |
            | TC_PC003 | admin | testautoforecast@gmail.com | Test1111# | QBFS        | 200            |
# | TC_PC004 | admin | testautoforecast@gmail.com | Test1111# | QBO         | 200            |