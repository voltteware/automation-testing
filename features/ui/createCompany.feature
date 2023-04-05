@test-ui @create-company-ui
Feature: Create new company on UI
    Background:
        Given User is on Login page
        
    @CreCom001
    Scenario Outline: CreCom001 - Verify create a new company with CSV type successfuly <scenario>
        Given User signs in with valid username "<username>" and the password "<currentPassword>" successfuly
        And User creates a new company to test subscription with name "<companyName>"
        Examples:
            | username                   | currentPassword | companyName        |
            | autotest@gmail.com         | Test1111#       | select-plan-auto   |
