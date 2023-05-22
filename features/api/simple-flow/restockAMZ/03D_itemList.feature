@test-api @regression-api @add-sku-shipments
Feature: API_Regression User can search, filter item in Item List
    Background: Send POST /login request to login before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @TC_ASC_SIL001 @smoke-test-api
    Scenario Outline: <TC_ID> - Verify user <email> could call APIs to search Item List
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api method to get all items in Item List with search function:
            | supplierFilter | keyword   |
            | [All Supplier] | <keyword> |
        And User sends a GET api method to get all items in Item List
        And The status text is "<expectedStatusText>"
        And The expected status code should be <expectedStatus>
        And User checks API contract of get items in Item list
        And User checks the system display the correct item list with keyword

        Examples:
            | TC_ID         | companyType | keyword | email                      | expectedStatus | expectedStatusText |
            | TC_ASC_SIL001 | ASC         | B       | testautoforecast@gmail.com | 200            | OK                 |
        
    @TC_ASC_FIL002 @smoke-test-api
    Scenario Outline: <TC_ID> - Verify user <email> could call APIs to filter Item List with flag <logic> status
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api method to get all items in Item List by filter function with flag, status:
            | supplierFilter | flag   | logic   | status   |
            | [All Supplier] | <flag> | <logic> | <status> |
        And User sends a GET api method to get all items in Item List
        And The status text is "<expectedStatusText>"
        And The expected status code should be <expectedStatus>
        And User checks API contract of get items in Item list
        And User checks the system display the correct item list by filter function with flag <logic> status

        Examples:
            | TC_ID           | companyType | flag   | logic | status | email                      | expectedStatus | expectedStatusText |
            | TC_ASC_FIL002_1 | ASC         | RED    | and   | WATCH  | testautoforecast@gmail.com | 200            | OK                 |
            | TC_ASC_FIL002_2 | ASC         | YELLOW | or    | ACTIVE | testautoforecast@gmail.com | 200            | OK                 |