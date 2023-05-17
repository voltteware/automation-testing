@test-api @api-dashboard @api-exportItem
Feature: API_Dashboard PUT /api/sync/item/download?<fields>
    Background: Send GET /realm request to get all company keys of current logged in user before each test
        Given user sends a POST login request to get valid cookie with role
            | role  | username                      | password  |
            | admin | nov9@gmail.com    | Test1111! |
        And User sets GET api endpoint to get companies information of current user
        And In Header of the request, she sets param Cookie as valid connect.sid
        When User sends a GET request to get companies
        Then User picks random company which has onboarded in above response
        And User sets GET api endpoint to get information of a company belongs to themself using company key random
        And User sets valid cookie of themself and valid companyKey and valid companyType in the header
    
    # Manage Company > Items
    @TC_EI001 @smoke-test-api @regression-api 
    Scenario Outline: <TC_ID> - Verify user <email> could call API export <section>
        # Create new item with contain text "Auto"
        Given User sets POST api endpoint to create item
        And User sets request body with payload as name: "<itemName>" and description: "<description>" and vendorName: "" and vendorPrice: "<vendorPrice>" and moq: "<moq>" and leadTime: "<leadTime>" and orderInterval: "<orderInterval>" and serviceLevel: "<serviceLevel>" and onHand: "<onHand>" and onHandMin: "<onHandMin>" and onHandThirdParty: "<onHandThirdParty>" and onHandThirdPartyMin: "<onHandThirdPartyMin>" and lotMultipleQty: "<lotMultipleQty>" and lotMultipleItemName: "" and asin: "" and fnsku: "" and skuNotes: "" and prepNotes: "" and supplierRebate: "" and inboundShippingCost: "" and reshippingCost: "" and repackagingMaterialCost: "" and repackingLaborCost: "" and rank: "" and inventorySourcePreference: "" and average7DayPrice: "" and isFbm: "" and key: "" and vendorKey: "" and lotMultipleItemKey: ""
        And User sends a POST method to create item
        # Export Items
        And User sets POST api endpoint to export <section> with <columns>
        And User sets payload as name: "<removedItemKeys>"
        When User sends POST api endpoint to export <section>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Count item that is Hidden
        And User set GET api endpoint to count item that is hidden
        And User sends GET api endpoint to count item that is hidden
        # Count item that is Active
        And User sends GET api request to get all items
        # Check total items in export file = total item that is hidden + item that is active
        And User checks total items in export file EQUALS total <section>
        # Pick random item to check value in export file and in grid
        And User set GET api endpoint to get items with name contains "<containText>"
        And User sends a GET request to get list items
        And User picks <quantity> random items in above list items
        And User checks values of item that just picked the same as export file
        # Hide item after created
        And User sets PUT api endpoint to edit isHidden of the above item for company type <companyType> with new value: true
        And User sends a PUT request to edit the item
        Examples:
            | TC_ID    | companyType | email                      | section | quantity | containText | expectedStatus | expectedStatusText | removedItemKeys | itemName      | description     | vendorPrice | moq    | leadTime | orderInterval | serviceLevel | onHand | onHandMin | onHandThirdParty | onHandThirdPartyMin | lotMultipleQty | columns                                                               |
            | TC_EI001 | CSV         | nov9@gmail.com             | item    | 3        | Auto        | 200            | OK                 |                 | New Item Auto | New description | random      | random | random   | random        | random       | random | random    | random           | random              | random         | name,vendorName,vendorPrice,moq,serviceLevel,onHand,onHandThirdParty  |

    # Manage Company > Suppliers
    @TC_EI002 @smoke-test-api @regression-api 
    Scenario Outline: <TC_ID> - Verify user <email> could call API export <section>
        # Create new supplier with contain text "Auto"
        Given User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User checks "<supplierKeyWord>" supplier exist in the system, if it does not exist will create new supplier
        # Export Items
        And User sets POST api endpoint to export <section> with <columns>
        And User sets payload as name: "<removedItemKeys>"
        When User sends POST api endpoint to export <section>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Count all suppliers
        And User sends a GET request to get total of suppliers
        # Check total items in export file = total suppliers in the grid
        And User checks total items in export file EQUALS total <section>
        # Pick random item to check value in export file and in grid
        And User sets GET api endpoint to get suppliers with limit row: <limitRow>
        And User sends a GET request to get list suppliers
        And User picks <quantity> random suppliers in above list suppliers
        And User checks values of <section> that just picked the same as export file
        # Delete supplier that just created
        And User filters <numberOfSuppliers> suppliers which has the name includes <supplierNameKeyword>
        And User checks there is at least 1 supplier found
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        When User sends a DELETE method to delete supplier
        Examples:
            | TC_ID    | companyType | email          | section   | supplierNameKeyword | numberOfSuppliers | quantity | limitRow | containText | expectedStatus | expectedStatusText | removedItemKeys | supplierName      | description     | emailSupplier       | moq    | leadTime | orderInterval | serviceLevel | columns                                          |
            | TC_EI002 | CSV         | nov9@gmail.com | supplier  | Auto                | 1                 | 3        | 10       | Auto        | 200            | OK                 |                 | New Supplier Auto | New description | emailtest@gmail.com | random | random   | random        | random       | name,leadTime,orderInterval,averageHistoryLength |

    # Manage Company > Demand
    @TC_EI003 @smoke-test-api @regression-api 
    Scenario Outline: <TC_ID> - Verify user <email> could call API export <section>
        # Create new supplier with contain text "Auto"
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get demands with limit row: <limitRow>
        And User sends a GET request to get list demands
        And User checks any demand exist in the system, if it does not exist will create new demand
        # Export Items
        And User sets POST api endpoint to export <section> with <columns>
        And User sets payload as name: "<removedItemKeys>"
        When User sends POST api endpoint to export <section>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Count all suppliers
        And User sends a GET request to get total of demands
        # Check total items in export file = total suppliers in the grid
        And User checks total items in export file EQUALS total <section>
        # Pick random item to check value in export file and in grid
        And User sets GET api endpoint to get demands with limit row: <limitRow>
        And User sends a GET request to get list demands
        And User picks <quantity> random demands in above list demands
        And User checks values of <section> that just picked the same as export file
        Examples:
            | TC_ID    | companyType | email          | section | quantity | limitRow | containText | expectedStatus | expectedStatusText | removedItemKeys | supplierName      | description     | emailSupplier       | moq    | leadTime | orderInterval | serviceLevel | columns                          |
            | TC_EI003 | CSV         | nov9@gmail.com | demand  | 3        | 10       | Auto        | 200            | OK                 |                 | New Supplier Auto | New description | emailtest@gmail.com | random | random   | random        | random       | itemName,orderQty,openQty,refNum |

    # Manage Company > Supply
    @TC_EI004 @smoke-test-api @regression-api 
    Scenario Outline: <TC_ID> - Verify user <email> could call API export <section>
        # Create new supplier with contain text "Auto"
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User sets GET api endpoint to get supplies with limit row: <limitRow>
        And User sends a GET request to get list supplies
        And User checks any supply exist in the system, if it does not exist will create new supply
        # Export Items
        And User sets POST api endpoint to export <section> with <columns>
        And User sets payload as name: "<removedItemKeys>"
        When User sends POST api endpoint to export <section>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Count all suppliers
        And User sends a GET request to get total of supplies
        # Check total items in export file = total suppliers in the grid
        And User checks total items in export file EQUALS total <section>
        # Pick random item to check value in export file and in grid
        And User sets GET api endpoint to get supplies with limit row: <limitRow>
        And User sends a GET request to get list supplies
        And User picks <quantity> random supplies in above list supplies
        And User checks values of <section> that just picked the same as export file
        Examples:
            | TC_ID    | companyType | email          | section | quantity | limitRow | containText | expectedStatus | expectedStatusText | removedItemKeys | supplierName      | description     | emailSupplier       | moq    | leadTime | orderInterval | serviceLevel | columns                              |
            | TC_EI004 | CSV         | nov9@gmail.com | supply  | 3        | 10       | Auto        | 200            | OK                 |                 | New Supplier Auto | New description | emailtest@gmail.com | random | random   | random        | random       | vendorName,itemName,orderQty,openQty |

    # Manage Company > Edit Kits (Boms)
    @TC_EI005 @smoke-test-api @regression-api 
    Scenario Outline: <TC_ID> - Verify user <email> could call API export <section>
        # Create new supplier with contain text "Auto"
        Given User picks company which has onboarded before with type <companyType> in above response
        And User sets valid cookie of <email> and valid companyKey and valid companyType in the header
        And User set GET api endpoint to get items with name contains "<containText>"
        And User sends a GET request to get list items
        And User sets GET api endpoint to get boms with limit row: <limitRow>
        And User sends a GET request to get list limited boms
        And User checks any bom exist in the system, if it does not exist will create new bom
        # Export Items
        And User sets POST api endpoint to export <section> with <columns>
        And User sets payload as name: "<removedItemKeys>"
        When User sends POST api endpoint to export <section>
        Then The expected status code should be <expectedStatus>
        And The status text is "<expectedStatusText>"
        # Count all suppliers
        And User sends a GET request to get total of boms
        # Check total items in export file = total suppliers in the grid
        And User checks total items in export file EQUALS total <section>
        # Pick random item to check value in export file and in grid
        And User sets GET api endpoint to get boms with limit row: <limitRow>
        And User sends a GET request to get list limited boms
        And User picks <quantity> random boms in above list boms
        And User checks values of <section> that just picked the same as export file
        Examples:
            | TC_ID    | companyType | email          | section | quantity | limitRow | containText | expectedStatus | expectedStatusText | removedItemKeys | supplierName      | description     | emailSupplier       | moq    | leadTime | orderInterval | serviceLevel | columns                  |
            | TC_EI005 | CSV         | nov9@gmail.com | bom     | 3        | 10       | Auto        | 200            | OK                 |                 | New Supplier Auto | New description | emailtest@gmail.com | random | random   | random        | random       | parentName,childName,qty |