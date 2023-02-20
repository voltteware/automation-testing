@test-api @api-admin @api-deleteUser
Feature: API_Admin DELETE/User
    Background: Send GET request to get users keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username           | password  |
            | admin | may27pre@gmail.com | Test1111! |
        And User sets GET api endpoint to get 100 users has just created
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a GET request to get 100 latest users
        # And Check email exist in the system, if it does not exist will create user with email <testauto@gmail.com>
        And Check email exist in the system, if it does not exist will create user with below email
            | email              |
            | testauto@gmail.com |
    @DU001
    Scenario Outline: DU001 - Verify <user> could call this API to delete a user
        # Given User filters user to get user which he has the email
        Given User filters user to get user which has the email as <emailWantToDelete>
        And In Header of the request, user sets param Cookie as valid connect.sid
        # When User sends a DELETE method to delete user
        When User sends a DELETE method to delete user <emailWantToDelete>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | user  | emailWantToDelete  | expectedStatus | expectedStatusText |
            | admin | testauto@gmail.com | 200            | OK                 |

    #Bug API in case DU002
    @DU002
    Scenario Outline: DU002 - Verify error when user sends this API with <cookie> cookie

        # Given User filters user to get user which he has the email
        Given User filters user to get user which has the email as <emailWantToDelete>
        Then User sets DELETE api endpoint to delete user keys
        But User sets Cookie in HEADER as <cookie>
        When User sends a DELETE method to delete user <emailWantToDelete>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | emailWantToDelete   | cookie  | expectedStatus | expectedStatusText |
            | may27user@gmail.com | empty   | 401            | Unauthorized       |
            | may27user@gmail.com | invalid | 401            | Unauthorized       |

    #Bug API in case DU003
    @DU003
    Scenario Outline: DU003 - Verify <user> can't call this API to delete user
        # Given User filters user to get user which he has the email
        Given User filters user to get user which has the email as <emailWantToDelete>
        Then User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets DELETE api endpoint to delete user keys
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a DELETE method to delete user <emailWantToDelete>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | emailWantToDelete   | user | userA               | password  | expectedStatus | expectedStatusText |
            | may27user@gmail.com | user | may27user@gmail.com | Test1111! | 401            | Unauthorized       |


