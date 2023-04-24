@test-api @api-admin @api-renewTrial
Feature: API_Admin renewTrial/company
    Background: Send GET request to get companies keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | subscriptionauto@gmail.com | Test1111# |
        And User sets GET api endpoint to get 20 companies has just created
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a GET request to get 20 latest companies

    @TC_RT001 @regression-api @smoke-test-api
    Scenario Outline: TC_RT001 - Verify <user> could call this API to renew trial with the comapny has Canceled status
        Given Check <companyNameKeyWord> company exist in the system, if it does not exist will create company
        And User filters company to get company which has the company name included <companyNameKeyWord>
        And User sets DELETE api endpoint to delete company
        And User sends a DELETE method to <deleteType> delete the filtered company
        And User sets POST api endpoint to renew trial
        When User sends a POST method to renew trial
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks the status of company that just renewed trial is Trialing
        And User checks API contract essential types in the response of renew trial are correct

        Examples:
            | user  | companyNameKeyWord | deleteType | expectedStatus | expectedStatusText |
            | admin | AutoTest           | soft       | 200            | OK                 |

    #Bug API in case TC_RT002_1, TC_RT002_1
    @TC_RT002 @bug-permission @low-bug-skip
    Scenario Outline: <TC_ID> - Verify error when user sends this API with <cookie> cookie
        Given Check <companyNameKeyWord> company exist in the system, if it does not exist will create company
        And User filters company to get company which has the company name included <companyNameKeyWord>
        And User sets DELETE api endpoint to delete company
        And User sends a DELETE method to <deleteType> delete the filtered company
        And User sets POST api endpoint to renew trial
        And User sets Cookie in HEADER as <cookie>
        When User sends a POST method to renew trial
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | TC_ID      | companyNameKeyWord | deleteType | cookie  | expectedStatus | expectedStatusText |
            | TC_RT002_1 | AutoTest           | soft       | empty   | 401            | Unauthorized       |
            | TC_RT002_2 | AutoTest           | soft       | invalid | 401            | Unauthorized       |