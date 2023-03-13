@test-api @api-dashboard @api-get-supply
Feature: API_Dashboard GET /api/supply
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111! |
        And User sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get company keys
        Then User picks random company in above response

    @TC_GSL001
    Scenario Outline: TC_GSL001 - Verify user <email> could call this API to get list supplies by using company key and company type
        Given User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        And User sends a GET request to get list items
        And User sets GET api endpoint to get supplies with limit row: <limitRow>
        When User sends a GET request to get list supplies
        Then The expected status code should be <expectedStatus>
        And User checks any supply exist in the system, if it does not exist will create new supply
        And User picks random supply in above response
        And User checks API contract essential types in supply object are correct
        And User checks values in response of random supply are correct
        Examples:
            | user  | email                      | companyKey | limitRow | password  | expectedStatus |
            | admin | testautoforecast@gmail.com | random     | 10       | Test1111! | 200            |

    # Bug TC_GV002_1 and TC_GV002_2, return status code 200 when cookie invalid.
    @TC_GSL002 @bug-permission
    Scenario Outline: <scenario> - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        Given User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        And User sets GET api endpoint to get supply keys
        When User sends a GET request to get list supplies
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | scenario    | email                      | companyKey | cookie  | companyKeyHeader | companyTypeHeader | expectedStatus | expectedStatusText    |
            | TC_GSL002_1 | testautoforecast@gmail.com | random     | invalid | invalid          | invalid           | 401            | Unauthorized          |
            | TC_GSL002_2 | testautoforecast@gmail.com | random     | invalid | valid            | valid             | 401            | Unauthorized          |
            | TC_GSL002_3 | testautoforecast@gmail.com | random     | valid   | invalid          | invalid           | 400            | Company not found.    |
            | TC_GSL002_4 | testautoforecast@gmail.com | random     | valid   |                  |                   | 500            | Internal Server Error |

    @TC_GSL003 
    Scenario Outline: TC_GSL003 - Verify user <userA> could not call this API to get Supply of company which does not belongs to her
        Given User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets GET api endpoint to get information of a company belongs to <userB> using company key <companyKey>
        But User sets valid cookie of <userA> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get supply keys
        When User sends a GET request to get list supplies
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | userA               | userB                      | password  | companyKey | expectedStatus | expectedStatusText |
            | may27user@gmail.com | testautoforecast@gmail.com | Test1111! | random     | 400            | Company not found. |

    @TC_GSL004
    Scenario Outline: <TC_ID> - Verify user could set limit <limitRow> in this API to get list supplys sorted by refNum with direction <direction>
        Given User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get supply keys with limit row: <limitRow> and sort field: <sortField> with direction: <direction>
        When User sends a GET request to get list supplies
        Then The expected status code should be <expectedStatus>
        And Check total items in the response should be less than or equal <limitRow>
        And Check items in the response should be sort by field refNum with direction <direction>
        Examples:
            | TC_ID       | email                      | limitRow | sortField | direction | companyKey | expectedStatus |
            | TC_GSL004_1 | testautoforecast@gmail.com | 50       | refNum    | asc       | random     | 200            |
            | TC_GSL004_2 | testautoforecast@gmail.com | 50       | refNum    | desc      | random     | 200            |