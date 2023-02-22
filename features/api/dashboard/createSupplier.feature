@test-api @api-dashboard @api-createSupplier
Feature: API_Dashboard POST /api/vendor
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username           | password  |
            | admin | may27pre@gmail.com | Test1111! |
        And User sets GET api endpoint to get company keys
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get company keys

    @TC_CS001
    Scenario Outline: TC_CS001 - Verify user <email> could call this API to create supplier with <scenario>
        Given User picks random company in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets POST api endpoint to create suppliers
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        When User sets request body with payload as name: "<supplierName>" and description: "<description>" and email: "<emailSupplier>" and moq: <moq> and leadTime: <leadTime> and orderInterval: <orderInterval> and serviceLevel: <serviceLevel>
        And User sends a POST method to create supplier
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in supplier object are correct
        And User checks values in response of create supplier are correct
        Examples:
            | scenario            | email                      | supplierName      | description     | emailSupplier      | moq | leadTime | orderInterval | serviceLevel | companyKey | expectedStatus |
            | Supplier name valid | testautoforecast@gmail.com | New Supplier Auto | New description | newemail@gmail.com | 1   | 8        | 15            | 6            | random     | 200            |

    #TC_CS002_1, TC_CS002_2 fail due to bug api
    @TC_CS002 @bug-permission
    Scenario Outline: <scenario> - Verify error when user sends this API with <cookie> cookie, <companyKeyHeader> companyKey, <companyTypeHeader> companyType value in header
        Given User picks random company in above response
        And User sets POST api endpoint to create suppliers
        But User sets <cookie> cookie of <email> and <companyKeyHeader> companyKey and <companyTypeHeader> companyType in the header
        And User sets request body with payload as name: "<supplierName>" and description: "<description>" and email: "<emailSupplier>" and moq: <moq> and leadTime: <leadTime> and orderInterval: <orderInterval> and serviceLevel: <serviceLevel>
        When User sends a POST method to create supplier
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | scenario   | email                      | companyKey | cookie  | companyKeyHeader | companyTypeHeader | supplierName      | description     | emailSupplier      | moq | leadTime | orderInterval | serviceLevel | expectedStatus | expectedStatusText    |
            | TC_CS002_1 | testautoforecast@gmail.com | random     | invalid | invalid          | invalid           | New Supplier Auto | New description | newemail@gmail.com | 1   | 8        | 15            | 6            | 401            | Unauthorized          |
            | TC_CS002_2 | testautoforecast@gmail.com | random     | invalid | valid            | valid             | New Supplier Auto | New description | newemail@gmail.com | 1   | 8        | 15            | 6            | 401            | Unauthorized          |
            | TC_CS002_3 | testautoforecast@gmail.com | random     | valid   | invalid          | invalid           | New Supplier Auto | New description | newemail@gmail.com | 1   | 8        | 15            | 6            | 400            | Company not found.    |
            | TC_CS002_4 | testautoforecast@gmail.com | random     | valid   |                  |                   | New Supplier Auto | New description | newemail@gmail.com | 1   | 8        | 15            | 6            | 500            | Internal Server Error |

    @TC_CS003
    Scenario Outline: TC_CS003 - Verify user <userA> could not call this API to create Supplier of company which does not belongs to her
        Given User picks random company in above response
        And User has valid connect.sid of "<userA>" after send a POST request with payload as email: "<userA>" and password: "<password>"
        And User sets GET api endpoint to get information of a company belongs to <userB> using company key <companyKey>
        When User sets POST api endpoint to create suppliers
        But User sets valid cookie of <userA> and valid companyKey and valid companyType in the header
        Then User sets request body with payload as name: "<supplierName>" and description: "<description>" and email: "<emailSupplier>" and moq: <moq> and leadTime: <leadTime> and orderInterval: <orderInterval> and serviceLevel: <serviceLevel>
        And User sends a POST method to create supplier
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | userA               | userB                      | password  | companyKey | supplierName      | description     | emailSupplier      | moq | leadTime | orderInterval | serviceLevel | expectedStatus | expectedStatusText |
            | may27user@gmail.com | testautoforecast@gmail.com | Test1111! | random     | New Supplier Auto | New description | newemail@gmail.com | 1   | 8        | 15            | 6            | 400            | Company not found. |

    @TC_CS004
    Scenario Outline: TC_CS004 - Verify error Vendor already exists
        Given User picks random company in above response
        And User sets GET api endpoint to get information of a company belongs to <email> using company key <companyKey>
        And User sets POST api endpoint to create suppliers
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        When User sets request body with payload as name: "<supplierName>" and description: "<description>" and email: "<emailSupplier>" and moq: <moq> and leadTime: <leadTime> and orderInterval: <orderInterval> and serviceLevel: <serviceLevel>
        And User sends a POST method to create supplier
        And User sends a POST method to create supplier
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        Examples:
            | scenario            | email                      | supplierName      | description     | emailSupplier      | moq | leadTime | orderInterval | serviceLevel | companyKey | expectedStatus | expectedStatusText     |
            | Supplier name valid | testautoforecast@gmail.com | New Supplier Auto | New description | newemail@gmail.com | 1   | 8        | 15            | 6            | random     | 400            | Vendor already exists. |

    @TC_CS005
    Scenario Outline: <TC_ID> - Verify user <email> could call this API to create supplier with <scenario>
        Given User picks company with type ASC in above response
        And User sets POST api endpoint to create suppliers
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        When User sets request body with payload as name: "<supplierName>" and description: "<description>" and email: "<emailSupplier>" and moq: <moq> and leadTime: <leadTime> and orderInterval: <orderInterval> and serviceLevel: <serviceLevel> and targetOrderValue: <targetOrderValue> and freeFreightMinimum: <freeFreightMinimum> and restockModel: "<restockModel>"
        And User sends a POST method to create supplier
        Then The expected status code should be <expectedStatus>
        And User checks API contract essential types in supplier object are correct
        And User checks values in response of create supplier are correct
        Examples:
            | TC_ID      | scenario                                                          | email                      | supplierName      | description     | emailSupplier      | moq | leadTime | orderInterval | serviceLevel | targetOrderValue | freeFreightMinimum | restockModel | companyKey | expectedStatus |
            | TC_CS005_1 | ASC company restockModel = Use Store Rule (Supplier Ships to FBA) | testautoforecast@gmail.com | New Supplier Auto | New description | newemail@gmail.com | 1   | 10       | 30            | 10           | 100              | 100                | GLOBAL       | random     | 200            |
            | TC_CS005_2 | ASC company restockModel = Warehouse Ships to FBA                 | testautoforecast@gmail.com | New Supplier Auto | New description | newemail@gmail.com | 1   | 10       | 30            | 10           | 100              | 100                | LOCAL        | random     | 200            |
            | TC_CS005_3 | ASC company restockModel = Supplier Ships to FBA                  | testautoforecast@gmail.com | New Supplier Auto | New description | newemail@gmail.com | 1   | 10       | 30            | 10           | 100              | 100                | DIRECT_SHIP  | random     | 200            |







