@test-api @api-dashboard @api-demand @api-get-demand
Feature: API_Dashboard GET /api/demand
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testcreatedemand@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @TC_GD001_1_ASC @smoke-test-api
    Scenario Outline: TC_GD001_1 - Verify user <email> could call this API to get information of specific demand by using company key and company type (cannot create new demand)
        Given User picks company which has onboarded before with type ASC in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get demands with limit row: <limitRow>
        When User sends a GET request to get list demands
        Then The expected status code should be <expectedStatus>
        And User picks random demand in above response
        And User checks API contract essential types in demand object are correct
        And User checks values in response of random demand are correct
        Examples:
            | user  | email                      | password  | expectedStatus | limitRow |
            | admin | testcreatedemand@gmail.com | Test1111# | 200            | 10       |

    @TC_GD001_2_CSV @smoke-test-api
    Scenario Outline: TC_GD001_2 - Verify user <email> could call this API to get information of specific demand by using company key and company type (can create new demand)
        Given User picks company which has onboarded before with type CSV in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: <limitRow>
        # And User sends a GET request to get items information of <email> by company key and company type
        And User sends a GET request to get list items
        And User sets GET api endpoint to get demands with limit row: <limitRow>
        When User sends a GET request to get list demands
        Then The expected status code should be <expectedStatus>
        And User checks any demand exist in the system, if it does not exist will create new demand
        And User picks random demand in above response
        And User checks API contract essential types in demand object are correct
        And User checks values in response of random demand are correct
        Examples:
            | user  | email                      | password  | expectedStatus | limitRow |
            | admin | testcreatedemand@gmail.com | Test1111# | 200            | 10       |

    #Bug TC_GD002_1 and TC_GD002_2, return status code 200 when cookie invalid.
    @TC_GD002 @bug-permission @low-bug-skip
    Scenario Outline: <scenario> - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        Given User picks company which has onboarded before with type ASC in above response
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        And User sets GET api endpoint to get demand keys
        When User sends a GET request to get all demands
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | scenario   | email                      | cookie  | companyKeyHeader | companyTypeHeader | expectedStatus | expectedStatusText    |
            | TC_DB002_1 | testcreatedemand@gmail.com | invalid | invalid          | invalid           | 401            | Unauthorized          |
            | TC_GD002_2 | testcreatedemand@gmail.com | invalid | valid            | valid             | 401            | Unauthorized          |
            | TC_GD002_3 | testcreatedemand@gmail.com | valid   | invalid          | invalid           | 400            | Company not found.    |
            | TC_GD002_4 | testcreatedemand@gmail.com | valid   |                  |                   | 500            | Internal Server Error |

    @TC_GD003
    Scenario Outline: TC_GD003 - Verify user <userA> could not call this API to get demand of company which does not belongs to her
        Given User picks random company which has onboarded in above response
        And User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets GET api endpoint to get information of a company belongs to <userB> using company key <companyKey>
        But User sets valid cookie of <userA> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get demand keys
        When User sends a GET request to get all demands
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | userA               | userB              | password  | companyKey | expectedStatus | expectedStatusText |
            | may27user@gmail.com | may27pre@gmail.com | Test1111# | random     | 400            | Company not found. |

    @TC_GD004
    Scenario Outline: <TC_ID> - Verify user could set limit 10 in this API to get list demands sorted by <sortField> with direction <direction>
        Given User picks random company which has onboarded in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get demand with limit row: <limitRow> and sort field: <sortField> with direction: <direction>
        When User sends a GET request to get sorted demands
        Then The expected status code should be <expectedStatus>
        And Check total items in the response should be less than or equal <limitRow>
        And Check items in the response should be sort by field <sortField> with direction <direction>
        Examples:
            | TC_ID      | user  | email                      | companyKey | password  | limitRow | sortField | direction | expectedStatus |
            | TC_GD004_1 | admin | testcreatedemand@gmail.com | random     | Test1111# | 10       | dueDate   | asc       | 200            |
            | TC_GD004_2 | admin | testcreatedemand@gmail.com | random     | Test1111# | 10       | dueDate   | desc      | 200            |
            | TC_GD004_3 | admin | testcreatedemand@gmail.com | random     | Test1111# | 10       | fnsku     | asc       | 200            |
            | TC_GD004_4 | admin | testcreatedemand@gmail.com | random     | Test1111# | 10       | fnsku     | desc      | 200            |
            | TC_GD004_5 | admin | testcreatedemand@gmail.com | random     | Test1111# | 10       | openQty   | asc       | 200            |
            | TC_GD004_6 | admin | testcreatedemand@gmail.com | random     | Test1111# | 10       | openQty   | desc      | 200            |