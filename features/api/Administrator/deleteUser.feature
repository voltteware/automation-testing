@test-api @api-admin @api-deleteUser
Feature: API_Admin DELETE/User
    Background: Send GET request to get users keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie
            |role |username          | password  | 
            |admin|may27pre@gmail.com| Test1111! |
        And User sets GET api endpoint to get user keys
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User send request GET to get users keys
        And Check email exist in the system, if it does not exist will create user with email <testauto@gmail.com>
 
    @DU001
    Scenario Outline: DU001 - Verify <user> could call this API to get all user
        Given User filters user to get user which he has the email
        Given In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a DELETE method to delete user
        Then The expected status code should be <expectedStatus>
		And The status text is "<expectedStatusText>"

        Examples:
            | user  | expectedStatus | expectedStatusText |
            | admin | 200            | OK                 |
    
    #Bug API in case DU002
    @DU002
    Scenario Outline: DU002 - Verify error when user sends this API with <cookie> cookie

        Given User filters user to get user which he has the email 
        Then User sets DELETE api endpoint to delete user keys
        But User sets Cookie in HEADER as <cookie>
        When User sends a DELETE method to delete user
        Then The expected status code should be <expectedStatus>
		And The status text is "<expectedStatusText>"

        Examples:
            | cookie  | expectedStatus | expectedStatusText |
            | empty   | 401            | Unauthorized       |
            | invalid | 401            | Unauthorized       |

    #Bug API in case DU003
    @DU003
    Scenario Outline: DU003 - Verify <user> can't call this API to delete user
        Given User filters user to get user which he has the email
        Then User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets DELETE api endpoint to delete user keys
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a DELETE method to delete user
        Then The expected status code should be <expectedStatus>
		And The status text is "<expectedStatusText>"

        Examples:
            | user | userA              | password | expectedStatus | expectedStatusText |
            | user | may27user@gmail.com| Test1111!| 401            | Unauthorized       |


    