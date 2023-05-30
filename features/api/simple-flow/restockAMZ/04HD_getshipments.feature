@test-api @regression-api @api-getShipments
Feature: API_GET_Shipment User can get all shipments
    Background: Send POST /login request to login before each test
        Given user sends a POST login request to get valid cookie with role
            | role | username                | password  |
            | user | exportdatatest@gmail.com | Test1111# |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies

    @GS_HD001 @smoke-test-api @regression-api 
    Scenario Outline: <TC_ID> - Verify user <email> could call API export <section>
        # Pick ASC company 
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        # User count all shipments
        And User sets GET endpoint api to count all shipments
        When User sends GET endpoint api to count all shipments
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:         
            | TC_ID    | companyType | email                    | quantity | limitRow | containText | expectedStatus | expectedStatusText | removedItemKeys | supplierName      | description     | emailSupplier       | moq    | leadTime | orderInterval | serviceLevel |
            | GS_HD001 | ASC         | exportdatatest@gmail.com | 1        | 1        | Auto        | 200            | OK                 |                 | New Supplier Auto | New description | emailtest@gmail.com | random | random   | random        | random        | 
          