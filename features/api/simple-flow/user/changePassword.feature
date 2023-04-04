@test-api-extra @api-user @api-change-password
Feature: API_User PUT/user/password
    Background:
        Given Check testchangepass@gmail.com exist in the system, if it does not exist will create user with same email

    @TC_UCP001 @regression-api
    Scenario Outline: TC_UCP001 - Verify user could call this API to change password successfully
        Given User has valid connect.sid of "<email>" after send a POST request with payload as email: "<email>" and password: "<password>"
        And In Header of the request, user sets param Cookie as valid connect.sid
        And User sets request body with payload as password: <password> and newPassword <newPassword>
        When User sends a PUT method to change password of <email>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract essential types in user object are correct
        And UserId <email> in the response of API is correct
        And User sets request body with payload as password: <newPassword> and newPassword <password>
        When User sends a PUT method to change password of <email>
        Then The expected status code should be <expectedStatus>

        Examples:
            | email                    | password  | newPassword | expectedStatus | expectedStatusText |
            | testchangepass@gmail.com | Test1111# | Test1111#1  | 200            | OK                 |

    @TC_UCP002
    Scenario Outline: Verify that error in the response when user sends API with incorrect Current Password
        Given User has valid connect.sid of "<email>" after send a POST request with payload as email: "<email>" and password: "<password>"
        And In Header of the request, user sets param Cookie as valid connect.sid
        And User sets request body with payload as password: <incorrectCurrentPassword> and newPassword <incorrectCurrentPassword>
        When User sends a PUT method to change password of <email>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And Error message <errorMessage> in the response of API is displayed

        Examples:
            | email                    | password  | incorrectCurrentPassword | newPassword | expectedStatus | expectedStatusText | errorMessage                         |
            | testchangepass@gmail.com | Test1111# | 12345678                 | Test1111#   | 200            | OK                 | Incorrect current password for user. |

    @TC_UCP003
    Scenario Outline: Verify error when user sends this API with New Password empty
        Given User has valid connect.sid of "<email>" after send a POST request with payload as email: "<email>" and password: "<password>"
        And In Header of the request, user sets param Cookie as valid connect.sid
        And User sets request body with payload as password: <password> and newPassword <newPassword>
        When User sends a PUT method to change password of <email>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And Error message <errorMessage> in the response of API is displayed

        Examples:
            | email                    | password  | newPassword | expectedStatus | expectedStatusText | errorMessage                                  |
            | testchangepass@gmail.com | Test1111# |             | 200            | OK                 | Password does not meet strength requirements. |

    #Bug API in case TC_UCP004 and TC_UCP005
    @TC_UCP004 @TC_UCP005 @bug-permission @bug-1779
    Scenario Outline: <testId> - Verify error when user sends this API with <cookie> cookie
        But User sets Cookie in HEADER as <cookie>
        And User sets request body with payload as password: <password> and newPassword <newPassword>
        When User sends a PUT method to change password of <email>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | testId    | email                    | cookie  | expectedStatus | expectedStatusText |
            | TC_UCP004 | testchangepass@gmail.com | empty   | 401            | Unauthorized       |
            | TC_UCP005 | testchangepass@gmail.com | invalid | 401            | Unauthorized       |