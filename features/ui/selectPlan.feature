@test-ui @subscription-ui
Feature: Subscribe a plan for a company
    Background: 
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | subscriptionauto@gmail.com | Test1111# |
        And User sets POST api endpoint to create company
        Then User is on Login page
        
    @Sub001
    Scenario Outline: Sub001 - Verify a user select plan and subscribed successfully with Trialing status
        Given In Header of the request, User sets param Cookie as valid connect.sid
        And User sets request body with payload as companyName: "<companyName>" and companyKey: "" and companyType: "<companyType>" and serviceLevel: "<serviceLevel>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and initialSyncDate: "" and marketplaceId: ""
        And User sends a POST method to create company
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract essential types in company object are correct
        And User checks values in response of create company are correct
        And User signs in with valid username "<username>" and the password "<currentPassword>" successfully
        And User clicks username on top right corner
        And User clicks on Subscriptions
        And User is on Subscriptions page 
        And User clicks on subscription of "<companyName>" company to go to subscription detail page
        And User checks the warning message that the trial of <companyName> will be canceled
        And User checks show <companyName> company on header
        And User checks show default plan is <plan> on trialing mode
        And User clicks on any plan to select
        When User navigates to checkout page and input valid data in all fields "<card>", "<promotionCodeId>", "<expirationDate>"
        Then Verify user has been discounted with promotion code is <promotionCodeValue> percent and the plan has been highlighted with Current Plan
        And User sets DELETE api endpoint to delete company
        And User sends a DELETE method to delete the created company
        Examples:
            | username                   | currentPassword |  companyName             | companyType  | plan                         | status   | card                | promotionCodeId | promotionCodeValue| expirationDate| expectedStatusText     | expectedStatus | serviceLevel| leadTime| orderInterval|
            | subscriptionauto@gmail.com | Test1111#       |  Select Plan-AutoTest    | CSV          | Starter Monthly Subscription | Trialing | 4242 4242 4242 4242 | TEST20PR        | 20                | 08 / 23       | Created                | 201            | 85          | 15      | 15           |
