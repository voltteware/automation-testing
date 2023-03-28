@test-ui @profile
Feature: Profile Information
    Background:
        Given User is on Login page

    @P001
    Scenario Outline: AG001 - Verify the user profile information is displayed correctly
        Given User signs in with valid username "<username>" and the password "<currentPassword>" successfuly
        And User clicks username on top right corner
        And User clicks on Profile option
        When User is on Profile page
        Then Check Email field is disabled and shows correct value
        And Check Display Name field is disabled and shows correct value
        Examples:
            | username                   | currentPassword |
            | thegreentree1217@gmail.com | Test1111#       |

    @CP001
    Scenario Outline: <id> - Verify that the user could change password successfully
        Given User signs in with valid username "<username>" and the password "<currentPassword>" successfuly
        And User clicks username on top right corner
        And User clicks on Profile option
        And User is on Profile page
        When User enters current password "<currentPassword>"
        And User enters new password "<newPassword>"
        And User enters confirm new password "<newPassword>"
        Then User clicks Submit button then check toast "<message>" displayed
        And User logouts
        And User signs in with valid username "<username>" and the password "<newPassword>" successfuly
        And User clicks username on top right corner
        And User clicks on Profile option
        And User is on Profile page
        And User enters current password "<newPassword>"
        And User enters new password "<currentPassword>"
        And User enters confirm new password "<currentPassword>"
        And User clicks Submit button then check toast "<message>" displayed

        Examples:
            | id    | username        | currentPassword | newPassword | message                                  |
            | CP001 | oct11@gmail.com | Test1111#       | Test1111#1  | Success! Your password has been updated. |

    @CP002
    Scenario Outline: CP002 - Verify that error when user enters incorrect Current Password
        Given User signs in with valid username "<username>" and the password "<currentPassword>" successfuly
        And User clicks username on top right corner
        And User clicks on Profile option
        And User is on Profile page
        When User enters current password "<incorrectCurrentPassword>"
        And User enters new password "<currentPassword>"
        And User enters confirm new password "<currentPassword>"
        Then User clicks Submit button then check toast "<message>" displayed
        Examples:
            | username                   | incorrectCurrentPassword | currentPassword | message                              |
            | thegreentree1217@gmail.com | 12345678                 | Test1111#       | Incorrect current password for user. |

    @CP003
    Scenario Outline: CP003 - Verify error when user leaves New Password and Confirm New Password empty
        Given User signs in with valid username "<username>" and the password "<currentPassword>" successfuly
        And User clicks username on top right corner
        And User clicks on Profile option
        And User is on Profile page
        When User enters new password "<newPassword>"
        And User enters confirm new password "<confirmPassword>"
        Then Check new password format error
        And Check confirm new password does not match
        And Submit button should be disabled
        Examples:
            | username                   | currentPassword | newPassword    | confirmPassword |
            | thegreentree1217@gmail.com | Test1111#       | invalid format | not match       |
