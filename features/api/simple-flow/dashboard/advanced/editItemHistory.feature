@test-api @api-edit-item-history @api-dashboard @api-dashboard-advanced
Feature: API_Dashboard Advanced Edit Item History
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @TC_EIH001-4 @smoke-test-api
    Scenario Outline: <TC_ID> - Verify items showed on Edit Item History of company <companyType> should be active items
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And user sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        #Run Forecast
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And User checks that the lastForecastDate field was updated and jobProcessing is false in company detail information after running forecast
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
            | TC_EIH001 | admin | testautoforecast@gmail.com | Test1111# | CSV         | 200            |
            | TC_EIH002 | admin | testautoforecast@gmail.com | Test1111# | ASC         | 200            |
            | TC_EIH003 | admin | testautoforecast@gmail.com | Test1111# | QBFS        | 200            |
# | TC_EIH004 | admin | testautoforecast@gmail.com | Test1111# | QBO         | 200            |