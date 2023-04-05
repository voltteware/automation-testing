@test-api-extra @api-user @api-getUserInformation
Feature: API_User Get/User
    Background:
        Given Check testprofile@gmail.com exist in the system, if it does not exist will create user with same email

    @TC_U001 @regression-api @smoke-test-api
    Scenario Outline: TC_DU001 - Verify <user> could call this API to get user information
        Given User has valid connect.sid of "<email>" after send a POST request with payload as email: "<email>" and password: "<password>"
        # And User filters user to get user which has the email as <email>
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a GET method to get user information of <email>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract essential types in the response of get user information are correct
        And User checks API contract essential types in user object are correct
        And UserId <email> in the response of API is correct

        Examples:
            | email                 | password  | expectedStatus | expectedStatusText |
            | testprofile@gmail.com | Test1111# | 200            | OK                 |

    #Bug API in case U002
    @TC_U002 @bug-permission @bug-1779
    Scenario Outline: TC_U002 - Verify error when user sends this API with <cookie> cookie
        But User sets Cookie in HEADER as <cookie>
        When User sends a GET method to get user information of <email>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | email                 | cookie  | expectedStatus | expectedStatusText |
            | testprofile@gmail.com | empty   | 401            | Unauthorized       |
            | testprofile@gmail.com | invalid | 401            | Unauthorized       |


