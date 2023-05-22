@test-api @api-admin @api-changeRoleToAdminThenRemove
Feature: API_Admin PUT api/admin/users/<userid>
    Background: Send GET request to get companies keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                        | password  |
            | admin | testchangeroletoadmin@gmail.com | Test1111# |
        And User sets GET api endpoint to get 20 users has just created
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a GET request to get 20 latest users

    @TC_ACTR001 @regression-api @smoke-test-api
    Scenario Outline: TC_ACTR001 - Verify <user> could call this API to change user to admin role then remove
        Given Check <emailWantTochangeRole> exist in the system, if it does not exist will create user with same email
        And Login with admin account to check new user <emailWantTochangeRole> is showed in the response of get all users
        And <user> filters user to get user which has the email as <emailWantTochangeRole>
        And In Header of the request, user sets param Cookie as valid connect.sid
        And <user> sets PUT api endpoint to change user to admin role
        When <user> sends a PUT method to change user to admin role
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And <user> checks that Admin status is true
        And User checks API contract essential types in the response of change user to admin role are correct
        And <user> sets PUT api endpoint to change admin to user role
        And <user> sends a PUT method to change admin to user role
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And <user> checks that Admin status is false
        And User checks API contract essential types in the response of change admin to user role are correct
        And User sends a DELETE method to delete user <emailWantTochangeRole>

        Examples:
            | user  | username                        | emailWantTochangeRole           | expectedStatus | expectedStatusText |
            | Admin | testchangeroletoadmin@gmail.com | changeroletoadminauto@gmail.com | 200            | OK                 |

    #Bug API in case TC_ACTR002_1, TC_ACTR002_1
    @TC_ACTR002 @bug-permission @low-bug-skip
    Scenario Outline: <TC_ID> - Verify error when user sends this API with <cookie> cookie
        Given Check <emailWantTochangeRole> exist in the system, if it does not exist will create user with same email
        And Login with admin account to check new user <emailWantTochangeRole> is showed in the response of get all users
        And <user> filters user to get user which has the email as <emailWantTochangeRole>
        And In Header of the request, user sets param Cookie as valid connect.sid
        And <user> sets PUT api endpoint to change user to admin role
        When <user> sends a PUT method to change user to admin role
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | TC_ID        | user  | username                        | emailWantTochangeRole           | cookie  | expectedStatus | expectedStatusText |
            | TC_ACTR002_1 | Admin | testchangeroletoadmin@gmail.com | changeroletoadminauto@gmail.com | empty   | 401            | Unauthorized       |
            | TC_ACTR002_2 | Admin | testchangeroletoadmin@gmail.com | changeroletoadminauto@gmail.com | invalid | 401            | Unauthorized       |
