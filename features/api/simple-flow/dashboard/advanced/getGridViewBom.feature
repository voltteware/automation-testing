@test-api @api-dashboard @api-getGridViewBom
Feature: API_Dashboard GET /api/grid-view/bom
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get company keys

    @TC_GVB001
    Scenario Outline: TC_GVB001 - Verify user <email> could call this API to get grid view bom by using company key and CSV company type
        Given User picks company with type CSV in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get grid view boms
        When User sends a GET request to get grid view boms of <email> by company key and company type
        Then The expected status code should be <expectedStatus>
        And Check grid view bom exist in the company, if it does not exist will create grid view bom
        And User picks random grid view of bom in above response
        And User checks API contract essential types in grid view object are correct
        And User checks values in response of get grid view bom are correct
        Examples:
            | user  | email                      | password  | expectedStatus |
            | admin | testautoforecast@gmail.com | Test1111# | 200            |

    @TC_GVB002
    Scenario Outline: TC_GVB002 - Verify user <email> could call this API to get grid view bom by using company key and ASC company type
        Given User picks company with type ASC in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get grid view boms
        When User sends a GET request to get grid view boms of <email> by company key and company type
        Then The expected status code should be <expectedStatus>
        And Check grid view bom exist in the company, if it does not exist will create grid view bom
        And User picks random grid view of bom in above response
        And User checks API contract essential types in grid view object are correct
        And User checks values in response of get grid view bom are correct
        Examples:
            | user  | email                      | password  | expectedStatus |
            | admin | testautoforecast@gmail.com | Test1111# | 200            |

    # Bug TC_GVB003_1 and TC_GVB003_2, return status code 200 when cookie invalid.
    @TC_GVB003 @bug-permission
    Scenario Outline: <scenario> - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        Given User picks company with type ASC in above response
        And User sets GET api endpoint to get grid view boms
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        When User sends a GET request to get grid view boms of <email> by company key and company type
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | scenario     | email                      | companyKey | cookie  | companyKeyHeader | companyTypeHeader | expectedStatus | expectedStatusText    |
            | TC_GVB003_1  | testautoforecast@gmail.com | random     | invalid | invalid          | invalid           | 401            | Unauthorized          |
            | TC_GVB003_2  | testautoforecast@gmail.com | random     | invalid | valid            | valid             | 401            | Unauthorized          |
            | TC_GVB003_3  | testautoforecast@gmail.com | random     | valid   | invalid          | invalid           | 400            | Company not found.    |
            | TC_GVB003_4  | testautoforecast@gmail.com | random     | valid   |                  |                   | 500            | Internal Server Error |

    @TC_GVB004 
    Scenario Outline: TC_GVB004 - Verify user <userA> could not call this API to get grid view in the bom of company which does not belongs to her
        Given User picks random company in above response
        And User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets GET api endpoint to get information of a company belongs to <userB> using company key <companyKey>
        And User sets GET api endpoint to get grid view boms
        But User sets valid cookie of <userA> and valid companyKey and valid companyType in the header
        When User sends a GET request to get grid view boms of <userB> by company key and company type
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | userA               | userB                      | password  | companyKey | expectedStatus | expectedStatusText |
            | may27user@gmail.com | testautoforecast@gmail.com | Test1111# | random     | 400            | Company not found. |

    #Bug @TC_GVB005, return status code 200 when call this API for company QBFS.
    @TC_GVB005
    Scenario Outline: TC_GVB005 - Verify user could not call this API with company QBFS
        Given User picks company with type QBFS in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | user  | email                      | password  | expectedStatus | expectedStatusText |
            | admin | testautoforecast@gmail.com | Test1111# | 400            | Bad request        |