@test-ui @create-company
Feature: Subscribe a plan for a company
    Background:
        Given User is on Login page
        
    @CreCom001
    Scenario Outline: CreCom001 - Verify create a new company with CSV type successfuly <scenario>
        Given User signs in with valid username "<username>" and the password "<currentPassword>" successfuly
        And User sets GET api endpoint to get company keys
        And User clicks the company name on the top right
        And User select option "<option>"
        Examples:
            | username                   | currentPassword |  option      |
            | testqaforecast@gmail.com   | Test1111!       |  +Add Comapny|
