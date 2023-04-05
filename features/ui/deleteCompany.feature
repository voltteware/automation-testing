@test-ui @delete-company-ui
Feature: Delete company
    Background:
        Given User is on Login page
        
    @CreCom001
    Scenario Outline: CreCom001 - Verify delete company successfuly <scenario>
        Given User signs in with valid username "<username>" and the password "<currentPassword>" successfuly
        And User deletes the company that has just created
        Examples:
            | username                   | currentPassword |
            | autotest@gmail.com         | Test1111!       |
