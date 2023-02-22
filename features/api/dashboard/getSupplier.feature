@test-api @api-dashboard @api-get-supplier
Feature: API_Dashboard GET /api/vendor
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111! |
        And User sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get company keys
        And User picks random company in above response

    @TC_GS001
    Scenario Outline: TC_GS001 - Verify user <email> could call this API to get information of specific supplier by using company key and company type
        Given User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers keys
        When User sends a GET request to get suppliers information of <email> by company key and company type
        Then The expected status code should be <expectedStatus>
        And Check supplier exist in the company, if it does not exist will create supplier
        Then User picks random suppliers in above response
        And User checks API contract essential types in supplier object are correct
        And User checks values in response of random supplier are correct
        Examples:
            | user  | email                      | password  | companyKey | expectedStatus |
            | admin | testautoforecast@gmail.com | Test1111! | random     | 200            |

    #Bug TC_GS002_1 and TC_GS002_2, return status code 200 when cookie invalid.
    @TC_GS002 @bug-permission
    Scenario Outline: <scenario> - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        Given User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        And User sets GET api endpoint to get suppliers keys
        When User sends a GET request to get suppliers information of <email> by company key and company type
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | scenario   | email                      | companyKey | cookie  | companyKeyHeader | companyTypeHeader | expectedStatus | expectedStatusText    |
            | TC_GS002_1 | testautoforecast@gmail.com | random     | invalid | invalid          | invalid           | 401            | Unauthorized          |
            | TC_GS002_2 | testautoforecast@gmail.com | random     | invalid | valid            | valid             | 401            | Unauthorized          |
            | TC_GS002_3 | testautoforecast@gmail.com | random     | valid   | invalid          | invalid           | 400            | Company not found.    |
            | TC_GS002_4 | testautoforecast@gmail.com | random     | valid   |                  |                   | 500            | Internal Server Error |

    @TC_GS003 
    Scenario Outline: TC_GS003 - Verify user <userA> could not call this API to get Supplier of company which does not belongs to her
        Given User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets GET api endpoint to get information of a company belongs to <userB> using company key <companyKey>
        But User sets valid cookie of <userA> and valid companyKey and valid companyType in the header
        When User sets GET api endpoint to get suppliers keys
        And User sends a GET request to get suppliers information of <email> by company key and company type
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | userA               | userB              | password  | companyKey | expectedStatus | expectedStatusText |
            | may27user@gmail.com | may27pre@gmail.com | Test1111! | random     | 400            | Company not found. |

    @TC_GS004
    Scenario Outline: <TC_ID> - Verify user could set limit 100 in this API to get list suppliers sorted by Lead Time with direction <direction>
        Given User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers keys with limit row: <limitRow> and sort field: <sortField> with direction: <direction>
        When User sends a GET request to get suppliers information of <email> by company key and company type
        Then The expected status code should be <expectedStatus>
        And Check total items in the response should be less than or equal <limitRow>
        And Check items in the response should be sort by field leadTime with direction <direction>
        Examples:
            | TC_ID      | user  | email                      | password  | limitRow | sortField | direction | companyKey | expectedStatus |
            | TC_GS004_1 | admin | testautoforecast@gmail.com | Test1111! | 100      | leadTime  | asc       | random     | 200            |
            | TC_GS004_2 | admin | testautoforecast@gmail.com | Test1111! | 100      | leadTime  | desc      | random     | 200            |






