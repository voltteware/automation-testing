@test-api @api-admin @api-addCompanyToAdminThenRemove
Feature: API_Admin addCompanytoAdmin/user
    Background: Send GET request to get companies keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | subscriptionauto@gmail.com | Test1111# |
        And User sets GET api endpoint to get 20 companies has just created
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a GET request to get 20 latest companies

    @TC_ACTR001 @regression-api @smoke-test-api
    Scenario Outline: TC_ACTR001 - Verify <user> could call this API to add company to Admin
        Given Check <companyNameKeyWord> company exist in the system, if it does not exist will create company
        And User filters company to get company which has the company name included <companyNameKeyWord>
        And User sets POST api endpoint to add company to Admin with usernames <username> and operation <add>
        When User sends a POST method to add company to Admin
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api endpoint to get company keys
        And User sends a GET request to get company keys
        And User verifies the above-mentioned company's existence in the Realm after adding successfully
        And User checks API contract essential types in the response of add company to admin are correct
        And User sets POST api endpoint to remove company from Admin with usernames <username> and operation <remove>
        And User sends a POST method to remove company from Admin
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User sets GET api endpoint to get company keys
        And User sends a GET request to get company keys
        And User verifies the above-mentioned company's existence in the Realm after removing successfully
        And User checks API contract essential types in the response of remove company from admin are correct

        Examples:
            | user  | username                   | companyNameKeyWord | expectedStatus | expectedStatusText | add          | remove            | 
            | admin | subscriptionauto@gmail.com | AutoTest           | 200            | OK                 | addToCompany | removeFromCompany |

    #Bug API in case TC_ACTR002_1, TC_ACTR002_1
    @TC_ACTR002 @bug-permission @low-bug-skip
    Scenario Outline: <TC_ID> - Verify error when user sends this API with <cookie> cookie
        Given Check <companyNameKeyWord> company exist in the system, if it does not exist will create company
        And User filters company to get company which has the company name included <companyNameKeyWord>
        And User sets Cookie in HEADER as <cookie>
        And User sets POST api endpoint to add company to Admin with usernames <username> and operation <operation>
        When User sends a POST method to <action> company <preposition> Admin
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | TC_ID        | username                   | companyNameKeyWord | cookie  | expectedStatus | expectedStatusText | operation         | action | preposition |
            | TC_ACTR002_1 | subscriptionauto@gmail.com | AutoTest           | empty   | 401            | Unauthorized       | addToCompany      | add    | to          |
            | TC_ACTR002_2 | subscriptionauto@gmail.com | AutoTest           | invalid | 401            | Unauthorized       | addToCompany      | add    | to          |
            | TC_ACTR002_3 | subscriptionauto@gmail.com | AutoTest           | empty   | 401            | Unauthorized       | removeFromCompany | remove | from        |
            | TC_ACTR002_4 | subscriptionauto@gmail.com | AutoTest           | invalid | 401            | Unauthorized       | removeFromCompany | remove | from        |