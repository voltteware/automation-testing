@test-api @api-edit-item-history @api-dashboard @api-dashboard-advanced @api-editItemHistory
Feature: API_Dashboard Advanced Edit Item History
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @TC_EI001-3 @smoke-test-api @regression-api
    Scenario Outline: <TC_ID> - Verify user can edit items history and go to Purchasing to view changes after run forecast
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get items with limit row: 10 and filter field: isHidden equals false
        And User sends a GET request to get list items
        And User  picks a random item which does not have Purchase As
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
        And User checks override history values in Purchasing
        Examples:
            | TC_ID     | user  | email                      | password  | companyType | expectedStatus | expectedStatusText | editColumn         | value |
            | TC_EIH001 | admin | testautoforecast@gmail.com | Test1111# | CSV         | 200            | OK                 | useHistoryOverride | true  |
            | TC_EIH002 | admin | testautoforecast@gmail.com | Test1111# | ASC         | 200            | OK                 | useHistoryOverride | true  |
            | TC_EIH003 | admin | testautoforecast@gmail.com | Test1111# | QBFS        | 200            | OK                 | useHistoryOverride | true  |
    
    @TC_EIH004-7 @smoke-test-api
    Scenario Outline: <TC_ID> - Verify items showed on Edit Item History of company <companyType> should be active items
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And user sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        #Run Forecast
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And User checks that the lastForecastDate field was updated and jobInitiator is null in company detail information after running forecast
        And User sets GET api endpoint to get count item in Edit Item History
        When User sends a GET request to get count items
        Then The expected status code should be <expectedStatus>
        And User checks API contract get count items are correct
        # TODO: check total numbers on UI matched with UI
        And User sets GET api endpoint to get default 30 items in "Edit Item History"
        And User sends GET request to get items in "Edit Item History"
        And The expected status code should be <expectedStatus>
        And User checks API contract essential types in item object are correct
        And User picks max 10 random items in above list items
        And User checks random items has status is Active
        # Find a hidden item and search on Item History. Expect return empty result
        And User sets GET api endpoint to get items with limit row: 10 and filter field: isHidden equals true
        And User sends a GET request to get list items
        And User picks a random item in above list items
        And User sets GET api endpoint to filter item by name or asin contains nameOfRandomItem
        And User sends a GET request to get list items
        And User checks the response of get item list returns empty array

        Examples:
            | TC_ID     | user  | email                      | password  | companyType | expectedStatus |
            | TC_EIH004 | admin | testautoforecast@gmail.com | Test1111# | CSV         | 200            |
            | TC_EIH005 | admin | testautoforecast@gmail.com | Test1111# | ASC         | 200            |
            | TC_EIH006 | admin | testautoforecast@gmail.com | Test1111# | QBFS        | 200            |
            # | TC_EIH007 | admin | testautoforecast@gmail.com | Test1111# | QBO         | 200            |