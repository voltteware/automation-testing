@test-api-extra @api-dashboard @api-supply @api-edit-some-value-on-grid
Feature: API_Dashboard PUT /api/supply/manual
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get company keys

    # Notes: Only supply of company type CSV and ASC can edit

    @TC_US001 @smoke-test-api
    Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a demand for company type (<companyType>)
        Given User picks company with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User sets GET api endpoint to get supplies with limit row: <limitRow>
        When User sends a GET request to get list supplies
        And User picks a random supply in above list supplies
        And User saves the supply key and order key
        And User sets PUT api endpoint to edit <editColumn> of the above supply for company type <companyType> with new value: <value>
        When User sends a PUT request to edit the supply
        Then The expected status code should be <expectedStatus>
        And The new <editColumn> of supply must be updated successfully

        Examples:
            | TC_ID       | companyType | email                      | limitRow | editColumn | value  | expectedStatus |
            | TC_US001_1  | ASC         | testautoforecast@gmail.com | 10       | poNum      | random | 200            |
            | TC_US001_12 | CSV         | testautoforecast@gmail.com | 10       | orderQty   | random | 200            |

    # Test case TC_US001_3, TC_US001_10 FAILED: The Date is pushed back 1 day when editing - Bug_ID: 1325
    @TC_US002
    Scenario Outline: <TC_ID> - Verify user <email> could call this API to update "<editColumn>" of a demand for company type (<companyType>)
        Given User picks company with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User sets GET api endpoint to get supplies with limit row: <limitRow>
        When User sends a GET request to get list supplies
        And User picks a random supply in above list supplies
        And User saves the supply key and order key
        And User sets PUT api endpoint to edit <editColumn> of the above supply for company type <companyType> with new value: <value>
        When User sends a PUT request to edit the supply
        Then The expected status code should be <expectedStatus>
        And The new <editColumn> of supply must be updated successfully

        Examples:
            | TC_ID       | companyType | email                      | limitRow | editColumn   | value  | expectedStatus |
            | TC_US001_2  | ASC         | testautoforecast@gmail.com | 10       | suppliername | random | 200            |
            | TC_US001_3  | ASC         | testautoforecast@gmail.com | 10       | receiveDate  | random | 200            |
            | TC_US001_4  | ASC         | testautoforecast@gmail.com | 10       | poDate       | random | 200            |
            | TC_US001_5  | ASC         | testautoforecast@gmail.com | 10       | orderQty     | random | 200            |
            | TC_US001_6  | ASC         | testautoforecast@gmail.com | 10       | openQty      | random | 200            |
            | TC_US001_7  | ASC         | testautoforecast@gmail.com | 10       | asin         | random | 200            |
            | TC_US001_8  | CSV         | testautoforecast@gmail.com | 10       | poNum        | random | 200            |
            | TC_US001_9  | CSV         | testautoforecast@gmail.com | 10       | suppliername | random | 200            |
            | TC_US001_10 | CSV         | testautoforecast@gmail.com | 10       | receiveDate  | random | 200            |
            | TC_US001_11 | CSV         | testautoforecast@gmail.com | 10       | poDate       | random | 200            |
            | TC_US001_13 | CSV         | testautoforecast@gmail.com | 10       | openQty      | random | 200            |