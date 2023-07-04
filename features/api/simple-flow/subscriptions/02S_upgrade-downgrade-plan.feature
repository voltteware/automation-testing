@test-api @api-subscriptions @api-upgrade-downgrade
Feature: API_Subscriptions api/billing/plan/id
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role | username                      | password  |
            | user | subscriptionapitest@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
    
    @TC_Switch001
    Scenario Outline: TC_Switch001 - Verify <email> could call this API to switch any plans in <status> status with subscrtipion have been added normal card
        Given User sends a GET request to get companies
        And User sets GET api endpoint to get current subscription with payment method
        And User picks company that has status <status> and has been added card
        And User sets GET api endpoint to get current plan of subscription
        Then User sends GET api endpoint to get current plan of subscription
        And User sets GET api endpoint to get all plans of system
        And User sends GET api endpoint to get all plans of system
        And User picks random plan except current plan to change any plan
        And User sets POST api endpoint to upgrade and downgrade
        And User sets request body with payload to upgrade and downgrade
        And User sends POST api endpoint to upgrade and downgrade
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks the system response message is <message> after switching plans successfully
        And User sets GET api endpoint to get current subscription with payment method
        And User sends GET api endpoint to get current subscription with payment method
        And User checks current subscription is subscription that has been chosen to switch
        Examples:
            | user | email                         | password  | status    | expectedStatus | expectedStatusText | message                     | 
            | user | subscriptionapitest@gmail.com | Test1111# | trialing  | 200            | OK                 | Switching plan successfully | 

    @TC_Switch002
    Scenario Outline: TC_Switch002 - Verify <email> could call this API to switch any <interval> plans in <status> status with subscrtipion have been added normal card
        Given User sends a GET request to get companies
        And User sets GET api endpoint to get current subscription with payment method
        And User picks company that has interval <interval>, status <status> and has been added card 
        And User sets GET api endpoint to get current plan of subscription
        Then User sends GET api endpoint to get current plan of subscription
        And User sets GET api endpoint to get all plans of system
        And User sends GET api endpoint to get all plans of system
        And User filters <interval> plans from list above
        And User picks random <interval> plan except current plan to switch any monthly plan
        And User sets POST api endpoint to upgrade and downgrade
        And User sets request body with payload to upgrade and downgrade
        And User sends POST api endpoint to upgrade and downgrade
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks the system response message is <message> after switching plans successfully
        And User sets GET api endpoint to get current subscription with payment method
        And User sends GET api endpoint to get current subscription with payment method
        And User checks current subscription is subscription that has been chosen to switch
        Examples:
            | user | email                         | password  | status  | expectedStatus | expectedStatusText | message                     | interval  |
            | user | subscriptionapitest@gmail.com | Test1111# | active  | 200            | OK                 | Switching plan successfully | month     |

    @TC_Switch003
    Scenario Outline: TC_Switch003 - Verify <email> could call this API to switch any <interval> plans in <status> status with subscrtipion have been added normal card
        Given User sends a GET request to get companies
        And User sets GET api endpoint to get current subscription with payment method
        And User picks company that has interval <interval>, status <status> and has been added card 
        And User sets GET api endpoint to get current plan of subscription
        Then User sends GET api endpoint to get current plan of subscription
        And User sets GET api endpoint to get all plans of system
        And User sends GET api endpoint to get all plans of system
        And User filters <interval> plans from list above
        And User picks random <interval> plan except current plan to switch any yearly plan
        And User sets POST api endpoint to upgrade and downgrade
        And User sets request body with payload to upgrade and downgrade
        And User sends POST api endpoint to upgrade and downgrade
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks the system response message is <message> after switching plans successfully
        And User sets GET api endpoint to get current subscription with payment method
        And User sends GET api endpoint to get current subscription with payment method
        And User checks current subscription is subscription that has been chosen to switch
        Examples:
            | user | email                         | password  | status  | expectedStatus | expectedStatusText | message                     | interval |
            | user | subscriptionapitest@gmail.com | Test1111# | active  | 200            | OK                 | Switching plan successfully | year     |

    @TC_Switch004
    Scenario Outline: TC_Switch004 - Verify <email> couldn't call this API to switch from yearly to monthly plans in <status> status with subscrtipion have been added normal card
        Given User sends a GET request to get companies
        And User sets GET api endpoint to get current subscription with payment method
        And User picks company that has interval year, status <status> and has been added card 
        And User sets GET api endpoint to get current plan of subscription
        Then User sends GET api endpoint to get current plan of subscription
        And User sets GET api endpoint to get all plans of system
        And User sends GET api endpoint to get all plans of system
        And User filters <interval> plans from list above
        And User picks random <interval> plan except current plan to switch from yearly to monthly
        And User sets POST api endpoint to upgrade and downgrade
        And User sets request body with payload to upgrade and downgrade
        And User sends POST api endpoint to upgrade and downgrade
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks the system response message is <message> after switching plans successfully
        And User sets GET api endpoint to get current subscription with payment method
        And User sends GET api endpoint to get current subscription with payment method
        And User checks current subscription is still kept
        Examples:
            | user | email                         | password  | status  | expectedStatus | expectedStatusText | message                                                    | interval |
            | user | subscriptionapitest@gmail.com | Test1111# | active  | 200            | OK                 | Switching from yearly plan to monthly plan is not allowed. | month     |

    @TC_Switch005
    Scenario Outline: TC_Switch005 - Verify <email> couldn't call this API to switch from monthly to yearly plans in <status> status with subscrtipion have been added normal card
        Given User sends a GET request to get companies
        And User sets GET api endpoint to get current subscription with payment method
        And User picks company that has interval month, status <status> and has been added card 
        And User sets GET api endpoint to get current plan of subscription
        Then User sends GET api endpoint to get current plan of subscription
        And User sets GET api endpoint to get all plans of system
        And User sends GET api endpoint to get all plans of system
        And User filters <interval> plans from list above
        And User picks random <interval> plan except current plan to switch from monthly to yearly
        And User sets POST api endpoint to upgrade and downgrade
        And User sets request body with payload to upgrade and downgrade
        And User sends POST api endpoint to upgrade and downgrade
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks the system response message is <message> after switching plans successfully
        And User sets GET api endpoint to get current subscription with payment method
        And User sends GET api endpoint to get current subscription with payment method
        And User checks current subscription is still kept 
        Examples:
            | user | email                         | password  | status  | expectedStatus | expectedStatusText | message                                                                                        | interval |
            | user | subscriptionapitest@gmail.com | Test1111# | active  | 200            | OK                 | Your subscription will be changed to the chosen yearly plan after the current one has expired. | year     |


   