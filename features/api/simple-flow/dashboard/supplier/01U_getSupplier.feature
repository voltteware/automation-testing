@test-api @api-dashboard @api-supplier @api-get-supplier
Feature: API_Dashboard GET /api/vendor
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies
        Then User picks random company which has onboarded in above response

    @TC_GV001
    Scenario Outline: TC_GV001 - Verify user <email> could call this API to get list suppliers by using company key and company type
        Given User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        When User sends a GET request to get list suppliers
        Then The expected status code should be <expectedStatus>
        And user checks any supplier exist in the system, if it does not exist will create new supplier
        And User picks random supplier in above response
        And User checks API contract essential types in supplier object are correct
        And User checks values in response of random supplier are correct
        Examples:
            | user  | email                      | password  | companyKey | expectedStatus | limitRow |
            | admin | testautoforecast@gmail.com | Test1111# | random     | 200            | 10       |

    #Bug TC_GV002_1 and TC_GV002_2, return status code 200 when cookie invalid.
    @TC_GV002 @bug-permission @low-bug-skip
    Scenario Outline: <scenario> - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        Given User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        And User sets GET api endpoint to get suppliers keys
        When User sends a GET request to get list suppliers
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | scenario   | email                      | companyKey | cookie  | companyKeyHeader | companyTypeHeader | expectedStatus | expectedStatusText    |
            | TC_GV002_1 | testautoforecast@gmail.com | random     | invalid | invalid          | invalid           | 401            | Unauthorized          |
            | TC_GV002_2 | testautoforecast@gmail.com | random     | invalid | valid            | valid             | 401            | Unauthorized          |
            | TC_GV002_3 | testautoforecast@gmail.com | random     | valid   | invalid          | invalid           | 400            | Company not found.    |
            | TC_GV002_4 | testautoforecast@gmail.com | random     | valid   |                  |                   | 500            | Internal Server Error |

    @TC_GV003
    Scenario Outline: TC_GV003 - Verify user <userA> could not call this API to get Supplier of company which does not belongs to her
        Given User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets GET api endpoint to get information of a company belongs to <userB> using company key <companyKey>
        But User sets valid cookie of <userA> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers keys
        When User sends a GET request to get list suppliers
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | userA               | userB              | password  | companyKey | expectedStatus | expectedStatusText |
            | may27user@gmail.com | may27pre@gmail.com | Test1111# | random     | 400            | Company not found. |

    @TC_GV004
    Scenario Outline: <TC_ID> - Verify user could set limit 10 in this API to get list suppliers sorted by field <sortField> with direction <direction>
        Given User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get suppliers keys with limit row: <limitRow> and sort field: <sortField> with direction: <direction>
        When User sends a GET request to get list suppliers
        Then The expected status code should be <expectedStatus>
        And Check total items in the response should be less than or equal <limitRow>
        And Check items in the response should be sort by field <sortField> with direction <direction>
        Examples:
            | TC_ID      | user  | email                      | password  | limitRow | sortField | direction | companyKey | expectedStatus |
            | TC_GV004_1 | admin | testautoforecast@gmail.com | Test1111# | 10       | name      | asc       | random     | 200            |
            | TC_GV004_2 | admin | testautoforecast@gmail.com | Test1111# | 10       | name      | desc      | random     | 200            |
            | TC_GV004_3 | admin | testautoforecast@gmail.com | Test1111# | 10       | leadTime  | asc       | random     | 200            |
            | TC_GV004_4 | admin | testautoforecast@gmail.com | Test1111# | 10       | leadTime  | desc      | random     | 200            |