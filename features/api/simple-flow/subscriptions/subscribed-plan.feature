@test-api @api-subscriptions @api-subscribed-plan
Feature: API_Subscriptions api/billing/checkout
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role | username                      | password  |
            | user | subscriptionapitest@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid

    @TC_SNP001
    Scenario Outline: TC_SNP001 - Verify <email> could call this API to subscribed a new plan with normal card and new company
        Given User sets POST api endpoint to create company
        And User sets request body with payload as companyName: "<companyName>" and companyKey: "" and companyType: "<companyType>" and serviceLevel: "<serviceLevel>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and initialSyncDate: "" and marketplaceId: ""
        And User sends a POST method to create company
        And User sets GET api endpoint to get all plans of system
        And User sends GET api endpoint to get all plans of system
        And User sets GET api endpoint to get current subscription with payment method
        And User sends GET api endpoint to get current subscription with payment method
        And User picks random plan to subscribe
        And User sets POST api endpoint to get Checkout link
        And User sets request body with payload to get Checkout link
        And User sends POST api endpoint to get Checkout link
        And The expected status code should be <expectedStatusSubscribe>
        And The status text is "<expectedStatusSubscribeText>"
        And User sets POST api endpoint to get GUID, MUID and SID
        And User sends POST api endpoint to get GUID, MUID and SID
        And The expected status code should be <expectedStatusSubscribe>
        And The status text is "<expectedStatusSubscribeText>"
        And User creates payment method to subscribe
        And User sets POST api endpoint to confirm subscribed
        And User sets request body with payload to confirm subscribed
        Then User sends POST api endpoint to confirm subscribed
        And The expected status code should be <expectedStatusSubscribe>
        And The status text is "<expectedStatusSubscribeText>"
        And User sets GET api endpoint to get latest subscription
        And User sends GET api endpoint to get latest subscription
        And User sets GET api endpoint to get current subscription with payment method
        And User sends GET api endpoint to get current subscription with payment method
        And User checks current subscription is subscription that has been subscribed
        Examples:
            | user | email                         | password  | companyName  | companyType | serviceLevel | leadTime | orderInterval | expectedStatus | expectedStatusSubscribe | expectedStatusSubscribeText | expectedStatusText | message                     | 
            | user | subscriptionapitest@gmail.com | Test1111# | random       | CSV         | random       | random   | random        | 200            | 201                     | Created                     | OK                 | Switching plan successfully | 