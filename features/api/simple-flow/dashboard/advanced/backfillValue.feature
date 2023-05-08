@test-api @api-dashboard @api-backfill-value
Feature: API_Dashboard PUT /api/history-override
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @TC_BFV001 @smoke-test-api @regression-api
    Scenario Outline: <TC_ID> - Verify the override history values display exactly in Purchasing after editing it and turning ON backfill feature for <companyType> company
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks a random item which does not have Purchase As
        And User saves the item key

        # Turn ON Override history
        And User sets PUT api endpoint to edit useHistoryOverride of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The expected status code should be <expectedStatus>
        # You must have at least one full year worth of data for this item in order to use Backfill feature
        And User sets PUT api endpoint to update history override for one full year of data
        And User sends a PUT request to update history override for one full year of data
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of update history override api

        # Turn ON Backfill feature
        And User sets PUT api endpoint to edit <editColumn> of the above item for company type <companyType> with new value: <value>
        And User sends a PUT request to edit the item
        And The new <editColumn> of item must be updated successfully

        # Get history override
        And User sets GET api endpoint to get history override of item
        And User sends a GET request to get history override of item
        And User checks API contract of get history override of item api
        # And User checks value after editing history override of item
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User saves the history override values

        # Get Company info before run forecast
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Run forecast
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast

        # Get item result to check history override values
        And User sets GET api endpoint to get results of item
        When User sends a GET request to get results of item
        Then User checks API contract of get results of item
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks override history values must be displayed exactly in Purchasing
        Examples:
            | TC_ID       | companyType | email                      | limitRow | expectedStatus | expectedStatusText | editColumn  | value |
            | TC_BFV001_1 | CSV         | testautoforecast@gmail.com | 20       | 200            | OK                 | useBackfill | true  |
            | TC_BFV001_2 | ASC         | testautoforecast@gmail.com | 20       | 200            | OK                 | useBackfill | true  |
            | TC_BFV001_3 | QBFS        | testautoforecast@gmail.com | 20       | 200            | OK                 | useBackfill | true  |