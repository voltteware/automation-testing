@test-api @api-dashboard @api-createCompany
Feature: API_Dashboard POST /api/company
    Background: Send POST /login request to login before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                   | password  |
            | admin | testautoforecast@gmail.com | Test1111! |
        And User sets POST api endpoint to create company
        
    @TC_CCP001
    Scenario Outline: <TC_ID> - Verify user <email> could call this API to create company with type <companyType> when input all data valid
        Given In Header of the request, User sets param Cookie as valid connect.sid
        And User sets request body with payload as companyName: "<companyName>" and companyKey: "" and companyType: "<companyType>" and serviceLevel: "<serviceLevel>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and initialSyncDate: "<initialSyncDate>" and marketplaceId: "<marketplaceId>"
        When User sends a POST method to create company
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract essential types in company object are correct
        And User checks values in response of create company are correct
        And Check that the company just created exists in the current companies list of his
        And And User sets DELETE api endpoint to delete company
        And User sends a DELETE method to delete the created company

        Examples:
            | TC_ID     | email                      | companyName | companyType | serviceLevel | leadTime | orderInterval | initialSyncDate | marketplaceId | expectedStatus | expectedStatusText |
            | TC_CCP001 | testautoforecast@gmail.com | random      | ASC         | random       | random   | random        | currentDate     | random        | 201            | Created            |

    @TC_CCP002 @TC_CCP003 @TC_CCP004
    Scenario Outline: <TC_ID> - Verify user <email> could call this API to create company with type <companyType> when input all data valid
        Given In Header of the request, User sets param Cookie as valid connect.sid
        And User sets request body with payload as companyName: "<companyName>" and companyKey: "" and companyType: "<companyType>" and serviceLevel: "<serviceLevel>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and initialSyncDate: "" and marketplaceId: ""
        When User sends a POST method to create company
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks API contract essential types in company object are correct
        And User checks values in response of create company are correct
        And Check that the company just created exists in the current companies list of his
        And And User sets DELETE api endpoint to delete company
        And User sends a DELETE method to delete the created company
        Examples:
            | TC_ID     | email                      | companyName | companyType | serviceLevel | leadTime | orderInterval | expectedStatus | expectedStatusText |
            | TC_CCP002 | testautoforecast@gmail.com | random      | CSV         | random       | random   | random        | 201            | Created            |
            | TC_CCP003 | testautoforecast@gmail.com | random      | QBO         | random       | random   | random        | 201            | Created            |
            | TC_CCP004 | testautoforecast@gmail.com | random      | QBFS        | random       | random   | random        | 201            | Created            |

    @TC_CCP005
    Scenario Outline: <TC_ID> - Verify error when user sends this API with <cookie> cookie
        Given User sets Cookie in HEADER as <cookie>
        And And User sets request body with payload as companyName: "<companyName>" and companyKey: "" and companyType: "<companyType>" and serviceLevel: "<serviceLevel>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and initialSyncDate: "" and marketplaceId: ""
        When User sends a POST method to create company
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | TC_ID       | email                      | companyName | companyType | serviceLevel | leadTime | orderInterval | cookie  | expectedStatus | expectedStatusText |
            | TC_CCP005_1 | testautoforecast@gmail.com | random      | CSV         | random       | random   | random        | empty   | 401            | Unauthorized       |
            | TC_CCP005_2 | testautoforecast@gmail.com | random      | CSV         | random       | random   | random        | invalid | 401            | Unauthorized       |

    @TC_CCP006
    Scenario Outline: <TC_ID> - Verify error company already exists
        Given In Header of the request, User sets param Cookie as valid connect.sid
        And User sets request body with payload as companyName: "<companyName>" and companyKey: "" and companyType: "<companyType>" and serviceLevel: "<serviceLevel>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and initialSyncDate: "" and marketplaceId: ""
        When User sends a POST method to create company
        When User sends a POST method to create company
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | TC_ID     | email                      | companyName | companyType | serviceLevel | leadTime | orderInterval | expectedStatus | expectedStatusText                             |
            | TC_CCP006 | testautoforecast@gmail.com | random      | CSV         | random       | random   | random        | 400            | Company name (or very similar) already exists. |