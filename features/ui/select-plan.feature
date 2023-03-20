@test-ui @subscription-ui
Feature: Subscribe a plan for a company
    Background: 
        Given User is on Login page
        
    @Sub001
    Scenario Outline: Sub001 - Verify a user select plan and subscribed successfully with Trialing mode <scenario>
        Given User signs in with valid username "<username>" and the password "<currentPassword>" successfuly
        And User creates a new company to test subscription
        And User clicks username on top right
        And User clicks on Subscriptions option
        When User is on Subscriptions page
        Then User clicks on subscription to navigate to subscription detail page
        Then User clicks on any plan to select
        And User navigates to checkout page and input valid data in all fields
        Then User deletes the company that has just created
        Examples:
            | username                   | currentPassword |  
            | autotest@gmail.com         | Test1111!       | 
