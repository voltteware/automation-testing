@test-api @api-dashboard @api-item @api-get-item-summary
Feature: API_Dashboard GET /api/item?summary=true&companyKey=<companyKey>&companyType=<companyType> 
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get company keys
        Then User picks random company in above response

    @TC_GIS001
    Scenario Outline: TC_GIS001 - Verify user <email> could call this API to get item summary by using company key and company type
        Given User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header        
        And User sets GET api endpoint to get item summary
        When User sends a GET request to get item summary
        Then The expected status code should be <expectedStatus>
        And User checks API contract in item summary object are correct
        And User sends GET api request to get all items
        And User checks number Items Out of Stock in response of item summary is correct
        And User checks number Items Out of Stock - Warehouse in response of item summary is correct
        And User checks number New Items last 30 days in response of item summary is correct
        And User checks number Items without Vendors Assigned in response of item summary is correct

        Examples:
            | user  | email                      | password  | companyKey | expectedStatus |
            | admin | testautoforecast@gmail.com | Test1111# | random     | 200            |

    #Bug TC_GIS002 and TC_GIS002, return status code 200 when cookie invalid.
    @TC_GIS002 @bug-permission @low-bug-skip
    Scenario Outline: <scenario> - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        And User sets GET api endpoint to get item summary
        When User sends a GET request to get item summary
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | scenario    | email                      | companyKey | cookie  | companyKeyHeader | companyTypeHeader | expectedStatus | expectedStatusText    |
            | TC_GIS002_1 | testautoforecast@gmail.com | random     | invalid | invalid          | invalid           | 401            | Unauthorized          |
            | TC_GIS002_2 | testautoforecast@gmail.com | random     | invalid | valid            | valid             | 401            | Unauthorized          |
            | TC_GIS002_3 | testautoforecast@gmail.com | random     | valid   | invalid          | invalid           | 400            | Company not found.    |
            | TC_GIS002_4 | testautoforecast@gmail.com | random     | valid   |                  |                   | 500            | Internal Server Error |

    @TC_GIS003
    Scenario Outline: TC_GIS003 - Verify user <userA> could not call this API to get item summary of company which does not belongs to her
        Given User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        But User sets valid cookie of <userA> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get item summary
        When User sends a GET request to get item summary
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | userA               | userB                      | password  | companyKey | expectedStatus | expectedStatusText |
            | may27user@gmail.com | testautoforecast@gmail.com | Test1111# | random     | 400            | Company not found. |






