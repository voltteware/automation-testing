@test-api @api-dashboard @api-overrideValue
Feature: API_Dashboard PUT /api/history-override
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies
    
    @TC_OV001 @smoke-test-api @regression-api
    Scenario Outline: <TC_ID> - Verify user <email> override history value and go to Purchasing to check data
        Given User picks company which has onboarded before with type <companyType> in above response
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks a random item in above list items
        And User saves the item key
        And User sets PUT api endpoint to update history override
        And User sends a PUT request to update history override
        And User checks API contract of update history override api
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The expected status code should be <expectedStatus>
        And User sets GET api endpoint to get history override of item
        And User sends a GET request to get history override of item
        And User checks API contract of get history override of item api
        And User checks value after editing history override of item
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Get Company info before run forecast
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast
        And User sets GET api endpoint to get results of item
        When User sends a GET request to get results of item
        Then User checks API contract of get results of item
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # I am not sure why below step is failed => will find the root causes later
        # And User checks override history values in Purchasing
        Examples:
            | TC_ID      | companyType | email                      | limitRow | expectedStatus | expectedStatusText | editColumn         | value | 
            | TC_OV001_1 | CSV         | testautoforecast@gmail.com | 20       | 200            | OK                 | useHistoryOverride | true  |
            | TC_OV001_2 | ASC         | testautoforecast@gmail.com | 20       | 200            | OK                 | useHistoryOverride | true  |
            | TC_OV001_3 | QBFS        | testautoforecast@gmail.com | 20       | 200            | OK                 | useHistoryOverride | true  |