@test-api @api-admin @api-lock-unlock
Feature: API_Admin
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                     | password  |
            | admin | testuserforecastrx@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @TC_LU001-3 @smoke-test-api
    Scenario Outline: <TC_ID> - Verify admin can lock by running forecast and unlock company <companyType>
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        # Get Company info before run forecast
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Run Forecast
        And User sets POST api to run forecast
        And User sends a POST request to run forecast
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract of run forecast api
        And User sets GET api endpoint to get list locked companies
        And User sends a GET request to get list locked companies
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks and finds locked company of <email>
        And User checks API contract essential types in company object are correct
        And User sets GET api to get information of "<companyType>" company
        And User sends GET request to get information of company
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets PUT api endpoint to unlock company
        And User sends a PUT request to unlock company
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract essential types in company object are correct
        And User sets GET api endpoint to get list locked companies
        And User sends a GET request to get list locked companies
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks whether company is locked or not

        Examples:
            | TC_ID    | role  | email                        | password  | companyType | expectedStatus | expectedStatusText |
            | TC_LU001 | admin | testuserforecastrx@gmail.com | Test1111# | CSV         | 200            | OK                 |
            | TC_LU002 | admin | testuserforecastrx@gmail.com | Test1111# | ASC         | 200            | OK                 |
            | TC_LU003 | admin | testuserforecastrx@gmail.com | Test1111# | QBFS        | 200            | OK                 |

    @TC_LU004 @smoke-test-api
    Scenario Outline: <TC_ID> - Verify admin can lock by running sync and unlock company for <companyType>
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        # Get Company info before run sync
        And User sets GET api endpoint to get company information by company key
        And User sends a GET request to get company information by company key
        # Run sync
        And User sets POST api endpoint to sync
        And User sends a POST request to sync
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api endpoint to get list locked companies
        And User sends a GET request to get list locked companies
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks and finds locked company of <email>
        And User checks API contract essential types in company object are correct
        And User sets GET api to get information of "<companyType>" company
        And User sends GET request to get information of company
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets PUT api endpoint to unlock company
        And User sends a PUT request to unlock company
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract essential types in company object are correct
        And User sets GET api endpoint to get list locked companies
        And User sends a GET request to get list locked companies
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks whether company is locked or not
        
        Examples:
            | TC_ID    | role  | email                        | password  | companyType | expectedStatus | expectedStatusText |
            | TC_LU004 | admin | testuserforecastrx@gmail.com | Test1111# | ASC         | 200            | OK                 |