@test-ui @subscription-ui
Feature: Subscribe a plan for a company
    Background: 
        Given User is on Login page
        
    @Sub001
    Scenario Outline: Sub001 - Verify a user select plan and subscribed successfully with Trialing status
        Given User signs in with valid username "<username>" and the password "<currentPassword>" successfuly
        And User creates a new company to test subscription with name "<companyName>"
        And User clicks username on top right corner
        And User clicks on Subscriptions option of <companyName>
        And User is on Subscriptions page 
        And User clicks on subscription of "<companyName>" company
        And User checks info on the banner correctly with <companyName> company
        And User checks show <companyName> company on header
        And User checks show default plan is <plan> on trialing mode
        And User clicks on any plan to select
        When User navigates to checkout page and input valid data in all fields "<card>", "<promotionCode>", "<expirationDate>"
        Then User select plan successfully 
        And User deletes the company that has just created "<companyName>"
        Examples:
            | username                   | currentPassword |  companyName             | plan                         | status   | card                | promotionCode| expirationDate|
            | autotest@gmail.com         | Test1111#       |  select-plan-auto     | Starter Monthly Subscription    | Trialing | 4242 4242 4242 4242 | TEST20PR     | 08 / 23       |

    @Sub002
    Scenario Outline: Sub002 - Verify a user select plan and subscribed successfully with Canceled status
        Given User signs in with valid username "<username>" and the password "<currentPassword>" successfuly
        And User clicks username on top right corner
        And User clicks on Subscriptions option of <companyName>
        And User is on Subscriptions page 
        And User checks subscription of "<companyName>" invisible on Subscription List
        And User switchs to <companyName> company that has Canceled subscription
        And User checks info of banner on Dashboard when switching to "<companyName>"
        And User clicks on link in banner to navigate to Subscription Detail page
        And User checks info on the banner correctly with Canceled status
        And User checks show <companyName> company on header
        And User clicks on any plan to select
        When User navigates to checkout page and input valid data in all fields "<card>", "<promotionCode>", "<expirationDate>"
        Then User select plan successfully with Canceled status
        Examples:
            | username                   | currentPassword | companyName    | plan                            | status   | card                | promotionCode| expirationDate|
            | autotest1@gmail.com        | Test1111#       | QBFS Oct 31    | Starter Monthly Subscription    | Canceled | 4242 4242 4242 4242 | TEST20PR     | 08 / 23       |
