@test-api @api-purchasing @api-get-girdview-suggested-pos
Feature: API_Purchasing GET api/grid-view/suggested-pos
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get company keys
        Then User picks random company in above response

    @TC_GVSP001
    Scenario Outline: TC_GVSP001 - Verify user <email> could call this API to get grid view suggested pos by using company key and company type
        Given User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        But User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get grid view suggested pos
        When User sends a GET request to get grid view suggested pos
        Then The expected status code should be <expectedStatus>
        And Check grid view suggested pos exist in the company, if it does not exist will create grid view suggested pos
        And User picks random grid view of suggested pos in above response
        And User checks API contract essential types in grid view object are correct
        And User checks values in response of get grid view suggested pos are correct
        Examples:
            | user  | email                      | password  | companyKey | expectedStatus |
            | admin | testautoforecast@gmail.com | Test1111# | random     | 200            |

    # Bug TC_GVSP002_1 and TC_GVSP002_2, return status code 200 when cookie invalid.
    @TC_GVSP002 @bug-permission
    Scenario Outline: <scenario> - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        Given User sets GET api endpoint to get grid view suggested pos
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        When User sends a GET request to get grid view suggested pos
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | scenario     | email                      | companyKey | cookie  | companyKeyHeader | companyTypeHeader | expectedStatus | expectedStatusText    |
            | TC_GVSP002_1 | testautoforecast@gmail.com | random     | invalid | invalid          | invalid           | 401            | Unauthorized          |
            | TC_GVSP002_2 | testautoforecast@gmail.com | random     | invalid | valid            | valid             | 401            | Unauthorized          |
            | TC_GVSP002_3 | testautoforecast@gmail.com | random     | valid   | invalid          | invalid           | 400            | Company not found.    |
            | TC_GVSP002_4 | testautoforecast@gmail.com | random     | valid   |                  |                   | 500            | Internal Server Error |

    @TC_GVSP003 
    Scenario Outline: TC_GVSP003 - Verify user <userA> could not call this API to get grid view suggested pos of company which does not belongs to her
        Given User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        But User sets GET api endpoint to get information of a company belongs to <userB> using company key <companyKey>
        And User sets GET api endpoint to get grid view suggested pos
        And User sets valid cookie of <userA> and valid companyKey and valid companyType in the header
        When User sends a GET request to get grid view suggested pos
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | userA               | userB                      | password  | companyKey | expectedStatus | expectedStatusText |
            | may27user@gmail.com | testautoforecast@gmail.com | Test1111# | random     | 400            | Company not found. |
    
