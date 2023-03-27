@test-api @api-admin @api-deleteCompany
Feature: API_Admin DELETE/company
    Background: Send GET request to get companies keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111! |
        And User sets GET api endpoint to get 20 companies has just created
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a GET request to get 20 latest companies

    @TC_DCP001 @regression-api
    Scenario Outline: TC_DCP001 - Verify <user> could call this API to hard delete a company
        Given Check <companyNameKeyWord> company exist in the system, if it does not exist will create company
        And User filters company to get company which has the company name included <companyNameKeyWord>
        And User sets DELETE api endpoint to delete company
        When User sends a DELETE method to delete the filtered company
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And Check that the company just deleted not exists in the current companies list

        Examples:
            | user  | companyNameKeyWord | expectedStatus | expectedStatusText |
            | admin | AutoTest           | 200            | OK                 |

    #Bug API in case TC_DCP002_1, TC_DCP002_1
    @TC_DCP002 @bug-permission
    Scenario Outline: <TC_ID> - Verify error when user sends this API with <cookie> cookie
        Given Check <companyNameKeyWord> company exist in the system, if it does not exist will create company
        And User filters company to get company which has the company name included <companyNameKeyWord>
        And User sets DELETE api endpoint to delete company
        But User sets Cookie in HEADER as <cookie>
        When User sends a DELETE method to delete the filtered company
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | TC_ID       | companyNameKeyWord | cookie  | expectedStatus | expectedStatusText |
            | TC_DCP002_1 | AutoTest           | empty   | 401            | Unauthorized       |
            | TC_DCP002_2 | AutoTest           | invalid | 401            | Unauthorized       |

    #Bug API in case TC_DCP003
    @TC_DCP003 @bug-permission
    Scenario Outline: TC_DCP003 - Verify <user> can't call this API to delete company
        Given Check <companyNameKeyWord> company exist in the system, if it does not exist will create company
        And User filters company to get company which has the company name included <companyNameKeyWord>
        And User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets DELETE api endpoint to delete company
        And In Header of the request, user sets param Cookie as valid connect.sid
        When User sends a DELETE method to delete the filtered company
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | companyNameKeyWord | user | userA               | password  | expectedStatus | expectedStatusText |
            | AutoTest           | user | may27user@gmail.com | Test1111! | 401            | Unauthorized       |