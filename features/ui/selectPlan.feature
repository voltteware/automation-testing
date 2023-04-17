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
        And User clicks on Subscriptions after clicking on the user name of <companyName> company
        And User is on Subscriptions page 
        And User clicks on subscription of "<companyName>" company to go to subscription detail page
        And User checks the warning message that the trial of <companyName> will be canceled
        And User checks show <companyName> company on header
        And User checks show default plan is <plan> with <status> status
        And User clicks on any plan to select
        When User navigates to checkout page and input valid data in all fields "<card>", "<promotionCodeId>", "<expirationDate>"
        Then Verify user has been discounted with promotion code is <promotionCodeValue> percent and the plan has been highlighted with Current Plan after clicking on "<buttonName>" button
        And User sets DELETE api endpoint to delete company
        And User sends a DELETE method to <deleteType> delete the created company
        Examples:
            | username                   | currentPassword |  companyName             | companyType  | status   | plan                         | status   | card                | promotionCodeId | promotionCodeValue| expirationDate| expectedStatusText     | expectedStatus | serviceLevel| leadTime| orderInterval| deleteType | buttonName  |
            | subscriptionauto@gmail.com | Test1111#       |  Select Plan-AutoTest    | CSV          | trialing | Starter Monthly Subscription | Trialing | 4242 4242 4242 4242 | TEST20PR        | 20                | 08 / 23       | Created                | 201            | 85          | 15      | 15           | hard       | Start Trial |

    @Sub002
    Scenario Outline: Sub002 - Verify the content with the subscription has canceled status
        Given User signs in with valid username "<username>" and the password "<currentPassword>" successfully
        And User switchs to <companyName> company that has Canceled subscription
        And User clicks username on top right corner
        And User clicks on Subscriptions after clicking on the user name of <companyName> company
        When User is on Subscriptions page
        Then User check that "<companyName>" of canceled comapny should not show on Subscription list
        And User checks warning message that the subscription is canceled in Subscription List
        And User clicks on link in banner to navigate to Subscription Detail page
        And User checks show <companyName> company on header
        And User checks show default plan is <plan> with <status> status
        Examples:
            | role | username                   | currentPassword | companyName                | status   | plan              | status   | card                | promotionCode| expirationDate|
            | user | subscriptionauto@gmail.com | Test1111#       | select-plan-after-canceled | canceled | Choose your plan  | Canceled | 4242 4242 4242 4242 | TEST20PR     | 08 / 23       | 

    @Sub003
    Scenario Outline: Sub003 - Verify a user select plan and subscribed successfully with Canceled status
        Given User signs in with valid username "<username>" and the password "<currentPassword>" successfully
        And User switchs to <companyName> company that has Canceled subscription
        And User clicks username on top right corner
        And User clicks on Subscriptions after clicking on the user name of <companyName> company
        And User is on Subscriptions page
        And User clicks on link in banner to navigate to Subscription Detail page
        And User clicks on any plan to select
        When User navigates to checkout page and input valid data in all fields "<card>", "<promotionCodeId>", "<expirationDate>"
        Then Verify user has been discounted with promotion code is <promotionCodeValue> percent and the plan has been highlighted with Current Plan after clicking on "<buttonName>" button
        And User sets GET api endpoint to get 20 companies has just created
        And In Header of the request, user sets param Cookie as valid connect.sid
        And User sends a GET request to get 20 latest companies
        And User filters company to get company which has the company name included <companyKeyWord>
        And User sets DELETE api endpoint to delete company
        And User sends a DELETE method to <deleteType> delete the filtered company
        Examples:
            | user  | username                   | currentPassword |  companyName                | companyKeyWord | companyType  | plan                         | status   | card                | promotionCodeId | promotionCodeValue| expirationDate| expectedStatusText     | expectedStatus | serviceLevel| leadTime| orderInterval| deleteType | buttonName |
            | admin | subscriptionauto@gmail.com | Test1111#       |  select-plan-after-canceled | canceled       | CSV          | Choose your plan             | Canceled | 4242 4242 4242 4242 | TEST20PR        | 20                | 08 / 23       | Created                | 201            | 85          | 15      | 15           | soft       | Subscribe  |