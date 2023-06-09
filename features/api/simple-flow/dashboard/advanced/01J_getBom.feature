@test-api @api-dashboard @api-bom @api-get-bom
Feature: API_Dashboard GET /api/bom
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username             | password  |
            | admin | testgetbom@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @TC_GB001
    Scenario Outline: TC_GB001 - Verify user <email> could call this API to get list boms by using company key and company type
        Given User picks company which has onboarded before with type CSV in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item with limit row: 30
        And User sends a GET request to get list items
        And User sets GET api endpoint to get bom keys
        And User sends a GET request to get all boms
        And User checks any bom exist in the system, if it does not exist will create new bom
        When User sends a GET request to get all boms
        Then The expected status code should be <expectedStatus>
        And User picks random bom in above response
        And User checks API contract essential types in bom object are correct
        And User checks values in response of random bom are correct
        Examples:
            | user  | email                | password  | expectedStatus | limitRow |
            | admin | testgetbom@gmail.com | Test1111# | 200            | 10       |

    # #Bug TC_GB002_1 and TC_GB002_2, return status code 200 when cookie invalid.
    @TC_GB002 @bug-permission @low-bug-skip @bug1676
    Scenario Outline: <scenario> - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        Given User picks company which has onboarded before with type ASC in above response
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        And User sets GET api endpoint to get bom keys
        When User sends a GET request to get all boms
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | scenario   | email                | cookie  | companyKeyHeader | companyTypeHeader | expectedStatus | expectedStatusText    |
            | TC_GB002_1 | testgetbom@gmail.com | invalid | invalid          | invalid           | 401            | Unauthorized          |
            | TC_GB002_2 | testgetbom@gmail.com | invalid | valid            | valid             | 401            | Unauthorized          |
            | TC_GB002_3 | testgetbom@gmail.com | valid   | invalid          | invalid           | 400            | Company not found.    |
            | TC_GB002_4 | testgetbom@gmail.com | valid   |                  |                   | 500            | Internal Server Error |

    @TC_GB003
    Scenario Outline: TC_GB003 - Verify user <userA> could not call this API to get bom of company which does not belongs to her
        Given User picks random company which has onboarded in above response
        And User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets GET api endpoint to get information of a company belongs to <userB> using company key <companyKey>
        But User sets valid cookie of <userA> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get bom keys
        When User sends a GET request to get all boms
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | userA               | userB              | password  | companyKey | expectedStatus | expectedStatusText |
            | may27user@gmail.com | may27pre@gmail.com | Test1111# | random     | 400            | Company not found. |

    @TC_GB004
    Scenario Outline: <TC_ID> - Verify user could set limit 10 in this API to get list bom sorted by Kit Qty with direction <direction>
        Given User picks company which has onboarded before with type ASC in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get bom keys with limit row: <limitRow> and sort field: <sortField> with direction: <direction>
        When User sends a GET request to get sorted boms
        Then The expected status code should be <expectedStatus>
        And Check total items in the response should be less than or equal <limitRow>
        And Check items in the response should be sort by field <sortField> with direction <direction>
        Examples:
            | TC_ID      | user  | email                | password  | limitRow | sortField | direction | expectedStatus |
            | TC_GB004_1 | admin | testgetbom@gmail.com | Test1111# | 10       | qty       | asc       | 200            |
            | TC_GB004_2 | admin | testgetbom@gmail.com | Test1111# | 10       | qty       | desc      | 200            |
            | TC_GB004_3 | admin | testgetbom@gmail.com | Test1111# | 10       | childName | asc       | 200            |
            | TC_GB004_4 | admin | testgetbom@gmail.com | Test1111# | 10       | childName | desc      | 200            |

    #Bug TC_GB005, return status code 200 when call this API for company QBFS.
    @TC_GB005 @bug1680 @low-bug-skip
    Scenario Outline: TC_GB005 - Verify user could not call this API with company QBFS
        Given User picks company which has onboarded before with type QBFS in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        When User sends a GET request to get all boms
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | user  | email                | password  | expectedStatus | expectedStatusText |
            | admin | testgetbom@gmail.com | Test1111# | 400            | Bad request        |