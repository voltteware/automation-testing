@test-api @regression-api @restock-calculation
Feature: API_Regression User can compare and check the formulas
    Background: Send POST /login request to login before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    # Pre-condition: Company should run forecast manually to save time
    @TC_ASC_RC001 @smoke-test-api
    Scenario Outline: <TC_ID> - Verify user <email> could call APIs to compare and check the formulas
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api method to get restock suggestion by vendor
        And User sends a GET api method to get restock suggestion by vendor
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Select option All Suppliers because it contains a lot of Items
        And User selects the All Suppliers in Supplier list
        And User sends a GET api method to count all Items have alerts in All Suppliers
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User saves needed alert items information
        And User compares and checks the total of Items which have alerts
        # Get Desc items to have data of Recommendation
        And User sets GET api method to get Items belonged to All Suppliers with direction: <direction>
        And User sends a GET api method to get Items belonged to All Suppliers
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User picks random item in Item list
        And User saves needed values for calculations
        And User checks value Sum on grid
        And User checks value Total Inbound on grid
        And User checks value Estimated Margin on grid
        And User checks value Suggestions on grid
        And User sets GET api method to restock calculation of specific Item
        And User sends a GET api method to restock calculation of specific Item
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User saves values in Restock model for calculations
        And User checks value Daily Sales Rate in Restock Model
        And User checks value Adj Daily Sales Rate in Restock Model
        And User checks value Average Daily Sales Rate in Restock Model
        And User checks value Required Inventory in Restock Model
        And User checks value Inventory Available in Restock Model
        And User checks value Recommendations in Restock Model

        Examples:
            | TC_ID          | companyType | email                      | direction | expectedStatus | expectedStatusText |
            | TC_ASC_RC001_1 | ASC         | testautoforecast@gmail.com | asc       | 200            | OK                 |
            | TC_ASC_RC002_2 | ASC         | testautoforecast@gmail.com | desc      | 200            | OK                 |