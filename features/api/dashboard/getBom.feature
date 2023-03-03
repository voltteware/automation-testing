@test-api @api-dashboard @api-bom @api-get-bom
Feature: API_Dashboard GET /api/bom
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111! |
        And User sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get company keys
        Then User picks random company in above response

    @TC_GB001
    Scenario Outline: TC_GB001 - Verify user <email> could call this API to get information of specific bom by using company key and company type
        Given User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get items information of <email> by company key and company type
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get bom information of <email> by company key and company type
        And user checks any bom exist in the system, if it does not exist will create new bom
        When User sends a GET request to get bom information of <email> by company key and company type
        Then The expected status code should be <expectedStatus>
        And User picks random bom in above response
        And User checks API contract essential types in bom object are correct
        And User checks values in response of random bom are correct
        Examples:
            | user  | email                      | password  | companyKey | expectedStatus | limitRow | 
            | admin | testautoforecast@gmail.com | Test1111! | random     | 200            | 100      |
    
    #Bug TC_GB002_1 and TC_GB002_2, return status code 200 when cookie invalid.
    @TC_GB002 @bug-permission
    Scenario Outline: <scenario> - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        Given User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        And User sets GET api endpoint to get bom keys
        When User sends a GET request to get bom information of <email> by company key and company type
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | scenario   | email                      | companyKey | cookie  | companyKeyHeader | companyTypeHeader | expectedStatus | expectedStatusText    |
            | TC_GB002_1 | testautoforecast@gmail.com | random     | invalid | invalid          | invalid           | 401            | Unauthorized          |
            | TC_GB002_2 | testautoforecast@gmail.com | random     | invalid | valid            | valid             | 401            | Unauthorized          |
            | TC_GB002_3 | testautoforecast@gmail.com | random     | valid   | invalid          | invalid           | 400            | Company not found.     |
            | TC_GB002_4 | testautoforecast@gmail.com | random     | valid   |                  |                   | 500            | Internal Server Error |
    
    @TC_GB003 
    Scenario Outline: TC_GB003 - Verify user <userA> could not call this API to get Supplier of company which does not belongs to her
        Given User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets GET api endpoint to get information of a company belongs to <userB> using company key <companyKey>
        But User sets valid cookie of <userA> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get bom keys
        When User sends a GET request to get bom information of <email> by company key and company type
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | userA               | userB              | password  | companyKey | expectedStatus | expectedStatusText |
            | may27user@gmail.com | may27pre@gmail.com | Test1111! | random     | 400            | Company not found. |

    @TC_GB004
    Scenario Outline: <TC_ID> - Verify user could set limit 100 in this API to get list bom sorted by Kit Qty with direction <direction>
        Given User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get bom keys with limit row: <limitRow> and sort field: <sortField> with direction: <direction>
        When User sends a GET request to get bom information of <email> by company key and company type
        Then The expected status code should be <expectedStatus>
        And Check total items in the response should be less than or equal <limitRow>
        And Check bom in the response should be sort by field qty with direction <direction>
        Examples:
            | TC_ID      | user  | email                      | password  | limitRow | sortField | direction | companyKey | expectedStatus |
            | TC_GB004_1 | admin | testautoforecast@gmail.com | Test1111! | 100      | qty       | asc       | random     | 200            |
            | TC_GB004_2 | admin | testautoforecast@gmail.com | Test1111! | 100      | qty       | desc      | random     | 200            |
    