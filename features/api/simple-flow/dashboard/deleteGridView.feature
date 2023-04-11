@test-api @api-admin @api-deleteGridView
Feature: API_DashBoard DELETE/deleteGridView
    Background: Send GET request to get grid view keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies
        Then User picks random company which has onboarded in above response
        And User sets GET api endpoint to get information of a company belongs to testautoforecast@gmail.com using company key random
        And User sets valid cookie of testautoforecast@gmail.com and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get grid view suppliers keys
        When User sends a GET request to get grid view suppliers of testautoforecast@gmail.com by company key and company type

    @TC_DGV001 @bug1872
    Scenario Outline: TC_DGV001 - Verify user <email> could call this API to delete grid view of a company belongs to her
        Given Check grid view supplier exist in the company, if it does not exist will create grid view supplier
        And User picks random grid view of suppliers in above response
        And User sets DELETE api endpoint to delete gridview by key
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        When User sends a DELETE method to delete grid view with key <key>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | email                      | expectedStatus | expectedStatusText | key    |
            | testautoforecast@gmail.com | 204            | No Content         | random |

    #TC_DGV002_1, TC_DGV002_2 fail due to bug api
    @TC_DGV002 @bug-permission @low-bug-skip
    Scenario Outline: <TC_ID> - Verify error when user sends this API with <cookie> cookie and <companyKeyHeader> companyKeyHeader and <companyTypeHeader> companyTypeHeader
        Given Check grid view supplier exist in the company, if it does not exist will create grid view supplier
        And User picks random grid view of suppliers in above response
        And User sets DELETE api endpoint to delete gridview by key
        And User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        When User sends a DELETE method to delete grid view with key <key>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | TC_ID       | email                      | key    | cookie  | companyKeyHeader | companyTypeHeader | expectedStatus | expectedStatusText    |
            | TC_DGV002_1 | testautoforecast@gmail.com | random | invalid | invalid          | invalid           | 401            | Unauthorized          |
            | TC_DGV002_2 | testautoforecast@gmail.com | random | invalid | valid            | valid             | 401            | Unauthorized          |
            | TC_DGV002_3 | testautoforecast@gmail.com | random | valid   | invalid          | invalid           | 400            | Company not found.    |
            | TC_DGV002_4 | testautoforecast@gmail.com | random | valid   |                  |                   | 500            | Internal Server Error |

    @TC_DGV003
    Scenario Outline: TC_DGV003 - Verify <userA> can't call this API to delete grid view not belongs to her company
        Given Check grid view supplier exist in the company, if it does not exist will create grid view supplier
        And User picks random grid view of suppliers in above response
        And User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets DELETE api endpoint to delete gridview by key
        And User sets valid cookie of "<userA>" and valid companyKey and valid companyType in the header
        When User sends a DELETE method to delete grid view with key <key>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | userA               | password  | key    | expectedStatus | expectedStatusText |
            | may27user@gmail.com | Test1111# | random | 400            | Company not found. |

    @TC_DGV004
    Scenario Outline: TC_DGV004 - Verify user <email> can't call this API to delete grid-view not exists in of a company
        Given Check grid view supplier exist in the company, if it does not exist will create grid view supplier
        And User picks random grid view of suppliers in above response
        And User sets DELETE api endpoint to delete gridview by key
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        When User sends a DELETE method to delete grid view with key <key>
        When User sends a DELETE method to delete grid view with key <key>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"

        Examples:
            | email                      | key    | expectedStatus | expectedStatusText |
            | testautoforecast@gmail.com | random | 404            | Not Found          |