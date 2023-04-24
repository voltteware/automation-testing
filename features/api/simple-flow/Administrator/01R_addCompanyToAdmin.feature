@test-api @api-admin @api-addCompanyToAdmin
Feature: API_Admin addCompanytoAdmin/user
    Background: Send GET request to get companies keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | subscriptionauto@gmail.com | Test1111# |
        And User sets GET api endpoint to get 20 companies has just created
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a GET request to get 20 latest companies

    @TC_ACTA001 @regression-api @smoke-test-api
    Scenario Outline: TC_ACTA001 - Verify <user> could call this API to add company to Admin
        Given Check <companyNameKeyWord> company exist in the system, if it does not exist will create company
        And User filters company to get company which has the company name included <companyNameKeyWord>
        And User sets POST api endpoint to add company to Admin has username <username>
        When User sends a POST method to add company to Admin
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api endpoint to get company keys
        And User sends a GET request to get company keys
        And User checks company that just added above exists in Realm
        And User checks API contract essential types in the response of add company to admin are correct

        Examples:
            | user  | username                   | companyNameKeyWord | expectedStatus | expectedStatusText |
            | admin | subscriptionauto@gmail.com | AutoTest           | 200            | OK                 |

    #Bug API in case TC_ACTA002_1, TC_ACTA002_1
    @TC_ACTA002 @bug-permission @low-bug-skip
    Scenario Outline: <TC_ID> - Verify error when user sends this API with <cookie> cookie
        Given Check <companyNameKeyWord> company exist in the system, if it does not exist will create company
        And User filters company to get company which has the company name included <companyNameKeyWord>
        And User sets Cookie in HEADER as <cookie>
        And User sets POST api endpoint to add company to Admin has username <username>
        When User sends a POST method to add company to Admin
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api endpoint to get company keys
        And User sends a GET request to get company keys
        And User checks company that just added above exists in Realm
        And User checks API contract essential types in the response of add company to admin are correct

        Examples:
            | TC_ID        | username                   | companyNameKeyWord | cookie  | expectedStatus | expectedStatusText |
            | TC_ACTA002_1 | subscriptionauto@gmail.com | AutoTest           | empty   | 401            | Unauthorized       |
            | TC_ACTA002_2 | subscriptionauto@gmail.com | AutoTest           | invalid | 401            | Unauthorized       |