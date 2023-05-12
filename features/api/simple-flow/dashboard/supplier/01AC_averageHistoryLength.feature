@test-api @api-dashboard @average-history-length
Feature: API_Dashboard Cannot update average history length
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                     | password  |
            | admin | testuserforecastrx@gmail.com | Test1111# |

    @TC_AHL001_CSV @smoke-test-api @bug1972
    Scenario Outline: <TC_ID> - Verify user <email> cannot update average history length in Supplier section when company is Onboarding
        Given In Header of the request, User sets param Cookie as valid connect.sid
        And User sets request body of create company api with payload
            | companyName   | companyKey | companyType   | serviceLevel   | leadTime   | orderInterval   | initialSyncDate | marketplaceId |
            | <companyName> | null       | <companyType> | <serviceLevel> | <leadTime> | <orderInterval> | null            | null          |
        And User sets POST api endpoint to create company
        And User sends a POST method to create company
        And User sets PUT api endpoint to update company keys
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets request body with payload as leadTime: <leadTime> and companyKey, companyType
        And User sends a PUT method to update company of "<email>" by company key
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract essential types in company object are correct
        And User checks values of <properties> in response of update company are correct
        And User sets POST api endpoint to create suppliers
        And User sets request body of create suppliers api with payload
            | name           | description   | emailSupplier   | moq   | leadTime   | orderInterval   | serviceLevel   | targetOrderValue | freeFreightMinimum | restockModel |
            | <supplierName> | <description> | <emailSupplier> | <moq> | <leadTime> | <orderInterval> | <serviceLevel> | null             | null               | null         |
        And User sends a POST method to create supplier
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract essential types in supplier object are correct
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User picks random supplier in above response
        And User saves the supplier key
        And User sets request body of edit supplier api with payload
            | editColumn   | companyType   | value   |
            | <editColumn> | <companyType> | <value> |
        When User sends a PUT request to edit the supplier
        Then User checks status code and status text of api
            | expectedStatus | expectedStatusText |
            | 400            | Bad Request        |
        And User checks API contract essential types in supplier object are correct

        Examples:
            | TC_ID         | properties | email                        | companyName | companyType | editColumn           | value  | serviceLevel | leadTime | orderInterval | expectedStatus | expectedStatusText | supplierName      | description     | emailSupplier      | moq    | limitRow | parentName |
            | TC_AHL001_CSV | leadTime   | testuserforecastrx@gmail.com | random      | CSV         | averageHistoryLength | random | random       | random   | random        | 200            | OK                 | New Supplier Auto | New description | newemail@gmail.com | random | 20       | random     |

    @TC_AHL001_ASC @smoke-test-api @bug1972 @run-this
    Scenario Outline: <TC_ID> - Verify user <email> cannot update average history length in Supplier section when company is Onboarding
        Given In Header of the request, user sets param Cookie as valid connect.sid
        And User sends a GET request to get all company
        And User selects onboarding company with type <companyType>
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets PUT api endpoint to update company keys
        And User sets request body with payload as leadTime: <leadTime> and companyKey, companyType
        And User sends a PUT method to update company of "<email>" by company key
        And The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract essential types in company object are correct
        And User checks values of <properties> in response of update company are correct
        And User sets POST api endpoint to create suppliers
        And User sets request body of create suppliers api with payload
            | name           | description   | emailSupplier   | moq   | leadTime   | orderInterval   | serviceLevel   | targetOrderValue | freeFreightMinimum | restockModel |
            | <supplierName> | <description> | <emailSupplier> | <moq> | <leadTime> | <orderInterval> | <serviceLevel> | null             | null               | null         |
        And User sends a POST method to create supplier
        And User checks status code and status text of api
            | expectedStatus   | expectedStatusText   |
            | <expectedStatus> | <expectedStatusText> |
        And User checks API contract essential types in supplier object are correct
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User picks random supplier in above response
        And User saves the supplier key
        And User sets request body of edit supplier api with payload
            | editColumn   | companyType   | value   |
            | <editColumn> | <companyType> | <value> |
        When User sends a PUT request to edit the supplier
        Then User checks status code and status text of api
            | expectedStatus | expectedStatusText |
            | 400            | Bad Request        |
        And User checks API contract essential types in supplier object are correct

        Examples:
            | TC_ID         | properties | companyType | editColumn           | value  | email                        | supplierName      | description     | emailSupplier      | moq    | leadTime | orderInterval | serviceLevel | limitRow | expectedStatus | expectedStatusText |
            | TC_IHL002_ASC | leadTime   | ASC         | averageHistoryLength | random | testuserforecastrx@gmail.com | New Supplier Auto | New description | newemail@gmail.com | random | random   | random        | random       | 10       | 200            | OK                 |
