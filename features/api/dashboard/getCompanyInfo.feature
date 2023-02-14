@test-api @api-dashboard @api-company-info
Feature: API_Dashboard GET /api/company/company key
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie
            | username           | password  |
            | may27pre@gmail.com | Test1111! |
        And She sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When She sends a GET request to get company keys
        And She picks random company in above response

    @TC_C001
    Scenario Outline: TC_C001 - Verify user <email> could call this API to get information of specific company by using company key
        Given she sets GET api endpoint to get information of company using company key <companyKey>
        And she sets valid cookie and valid companyKey and valid companyType in the header
        When she sends a GET request to get company information by company key
        Then The expected status code should be <expectedStatus>
        And User checks data type of common values in company object are correct
        And User checks data type of isAuthorized in response of get company by key are correct
        And She checks values in response of company are correct
        Examples:
            | user  | email              | password  | companyKey | expectedStatus |
            | admin | may27pre@gmail.com | Test1111! | random     | 200            |

    # (Bug API) Still return 200 even company Key and Type is invalid. Always 200 if cookie is valid => Incorrect
    @TC_C002
    Scenario Outline: TC_C002 - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        Given she sets GET api endpoint to get information of company using company key <companyKey>
        But she sets <cookie> cookie and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        When she sends a GET request to get company information by company key
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | companyKey | cookie  | companyKeyHeader | companyTypeHeader | expectedStatus | expectedStatusText |
            | random     | invalid | invalid          | invalid           | 401            | Unauthorized       |
            | random     | invalid | valid            | valid             | 401            | Unauthorized       |
# | random     | valid   | invalid          | invalid           | 401            | Unauthorized       |
# | random     | valid   |                  |                   | 401            | Unauthorized       |










