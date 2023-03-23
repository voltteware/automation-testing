@test-api @api-admin @api-getUser
Feature: API_Admin GET/User

    @USER001 @regression-api
    Scenario Outline: USER001 - Verify <email> could call this API to get all user
        Given User has valid connect.sid of "<user>" after send a POST request with payload as email: "<email>" and password: "<password>"
        And User sets GET api endpoint to get 20 users has just created
        And In Header of the request, user sets param Cookie as valid connect.sid
        When user sends a GET request to get 20 latest users
        Then The expected status code should be <expectedStatus>
        And User picks random user in above response
        And User checks data type of values in random user object are correct

        Examples:
            | user  | email              | password  | expectedStatus |
            | admin | may27pre@gmail.com | Test1111! | 200            |
    # BUG_API
    @USER002 @bug-permission
    Scenario Outline: USER002 - Verify <email> can't call this API to get all user
        Given User has valid connect.sid of "<user>" after send a POST request with payload as email: "<email>" and password: "<password>"
        And User sets GET api endpoint to get 20 users has just created
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a GET request to get 20 latest users
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | user | email               | password  | expectedStatus | expectedStatusText |
            | user | may27user@gmail.com | Test1111! | 401            | Unauthorized       |

    @USER003 @bug-permission
    Scenario Outline: USER003 - Verify error when user sends this API with <cookie> cookie
        Given User sets GET api endpoint to get 20 users has just created
        But User sets Cookie in HEADER as <cookie>
        When User sends a GET request to get 20 latest users
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | cookie  | expectedStatus | expectedStatusText |
            | empty   | 401            | Unauthorized       |
            | invalid | 401            | Unauthorized       |