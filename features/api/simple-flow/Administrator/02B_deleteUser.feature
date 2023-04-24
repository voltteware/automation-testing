@test-api @api-admin @api-deleteUser
Feature: API_Admin DELETE/User
    Background: Send GET request to get users keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username           | password  |
            | admin | may27pre@gmail.com | Test1111# |
        And User sets GET api endpoint to get 20 users has just created
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a GET request to get 20 latest users

    @TC_DU001 @regression-api @smoke-test-api
    Scenario Outline: TC_DU001 - Verify <user> could call this API to delete a user
        Given Check <emailWantToDelete> exist in the system, if it does not exist will create user with same email
        And Login with admin account to check new user <emailWantToDelete> is showed in the response of get all users
        And User filters user to get user which has the email as <emailWantToDelete>
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a DELETE method to delete user <emailWantToDelete>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | user  | emailWantToDelete  | expectedStatus | expectedStatusText |
            | admin | testauto@gmail.com | 200            | OK                 |

    #Bug API in case DU002
    @TC_DU002 @bug-permission @low-bug-skip
    Scenario Outline: TC_DU002 - Verify error when user sends this API with <cookie> cookie
        Given User filters user to get user which has the email as <emailWantToDelete>
        And User sets DELETE api endpoint to delete user keys
        But User sets Cookie in HEADER as <cookie>
        When User sends a DELETE method to delete user <emailWantToDelete>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | emailWantToDelete   | cookie  | expectedStatus | expectedStatusText |
            | may27user@gmail.com | empty   | 401            | Unauthorized       |
            | may27user@gmail.com | invalid | 401            | Unauthorized       |

    #Bug API in case DU003
    @TC_DU003 @bug-permission @low-bug-skip
    Scenario Outline: TC_DU003 - Verify <user> can't call this API to delete user
        Given User filters user to get user which has the email as <emailWantToDelete>
        And User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets DELETE api endpoint to delete user keys
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a DELETE method to delete user <emailWantToDelete>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | emailWantToDelete   | user | userA               | password  | expectedStatus | expectedStatusText |
            | may27user@gmail.com | user | may27user@gmail.com | Test1111# | 401            | Unauthorized       |