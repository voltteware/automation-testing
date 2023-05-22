@test-api @api-dashboard @api-get-gridview-demand
Feature: API_Dashboard GET /api/grid-view/demand
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testcreatedemand@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies
        Then User picks random company which has onboarded in above response

    @TC_GVD01
    Scenario Outline: TC_GVD001 - Verify user <email> could call this API to get grid view demand by using company key and company type
        Given User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get grid view demand keys
        When User sends a GET request to get grid view demand of <email> by company key and company type
        Then The expected status code should be <expectedStatus>
        And Check grid view demand exist in the company, if it does not exist will create grid view demand
        And User picks random grid view of demand in above response
        And User checks API contract essential types in grid view object are correct
        And User checks values in response of get grid view demand are correct
        Examples:
            | user  | email                      | password  | companyKey | expectedStatus |
            | admin | testcreatedemand@gmail.com | Test1111# | random     | 200            |

    # Bug TC_GVD002_1 and TC_GVD002_2, return status code 200 when cookie invalid.
    @TC_GVD002 @bug-permission @low-bug-skip
    Scenario Outline: <scenario> - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        Given User sets GET api endpoint to get grid view demand keys
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        When User sends a GET request to get grid view demand of <email> by company key and company type
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | scenario    | email                      | companyKey | cookie  | companyKeyHeader | companyTypeHeader | expectedStatus | expectedStatusText    |
            | TC_GVS002_1 | testcreatedemand@gmail.com | random     | invalid | invalid          | invalid           | 401            | Unauthorized          |
            | TC_GVS002_2 | testcreatedemand@gmail.com | random     | invalid | valid            | valid             | 401            | Unauthorized          |
            | TC_GVS002_3 | testcreatedemand@gmail.com | random     | valid   | invalid          | invalid           | 400            | Company not found.    |
            | TC_GVS002_4 | testcreatedemand@gmail.com | random     | valid   |                  |                   | 500            | Internal Server Error |

    @TC_GVD003
    Scenario Outline: TC_GVS003 - Verify user <userA> could not call this API to get grid view in the demand of company which does not belongs to her
        Given User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        But User sets GET api endpoint to get information of a company belongs to <userB> using company key <companyKey>
        And User sets GET api endpoint to get grid view demand keys
        And User sets valid cookie of <userA> and valid companyKey and valid companyType in the header
        When User sends a GET request to get grid view demand of <userB> by company key and company type
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | userA               | userB                      | password  | companyKey | expectedStatus | expectedStatusText |
            | may27user@gmail.com | testcreatedemand@gmail.com | Test1111# | random     | 400            | Company not found. |